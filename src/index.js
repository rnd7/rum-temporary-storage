import { Storage } from '@rnd7/rum-storage'

export const TEMPORARY_STORAGE_DEFAULTS = {
  scheduler: true,
  ttl: 1000*60*60*24,
  touchOnFind: true,
  touchOnList: true
}

export class TemporaryStorage extends Storage {

  constructor(opts) {
    super(Object.assign({}, TEMPORARY_STORAGE_DEFAULTS, opts))
    this._touched = {}
    this._wipe = this.wipe.bind(this)
    this._nextWipe = 0
    this._lastWipe = 0
  }

  set scheduler(val) {
    this._scheduler = val
    if (!this._scheduler && this._scheduled){
      this._scheduled = clearTimeout(this._scheduled)
    } else if (!this._scheduled) {
      this.wipe()
    }
  }

  get scheduler() {
    return this._scheduler
  }

  schedule(time) {
    if (!this._scheduler) return
    if (!this._nextWipe || this._nextWipe > time) {
      const now = Date.now()
      this._nextWipe = time //Math.max(this._lastWipe + this.minWipeInterval, time)
      if (this._scheduled)
        this._scheduled = clearTimeout(this._scheduled)

      this._scheduled = setTimeout(this._wipe, this._nextWipe - now)
    }
  }

  wipe() {
    const now = Date.now()
    const limit = now - this.ttl
    let next = 0
    for (let sid in this._touched) {
      let t = this._touched[sid]
      if (t <= limit) this.remove(sid)
      else if ( next == 0 || t < next) next = t
    }
    this._nextWipe = 0
    this._lastWipe = now
    if (next) this.schedule(next + this.ttl)
  }

  touch(sid) {
    const now = Date.now()
    this._touched[sid] = now
    this.schedule(now + this.ttl)
  }

  insert(record) {
    return super.insert(record).then(result=>{
      this.touch(this.indexIn(record))
      return result
    })
  }

  list() {
    return super.list().then(result=>{
      if (this.touchOnList) for (let index of result) this.touch(index)
      return result
    })
  }

  find(recordOrIndex) {
    return super.find(recordOrIndex).then(result=>{
      if (this.touchOnFind) {
        let index
        if (typeof recordOrIndex === "string") index = recordOrIndex
        else index = this.indexIn(recordOrIndex)
        this.touch(index)
      }
      return result
    })
  }

  update(record) {
    return super.update(record).then(result=>{
      this.touch(this.indexIn(record))
      return result
    })
  }

  upsert(record) {
    const index = this.indexIn(record)
    if (this._cache.hasOwnProperty(index)) return this.update(record)
    return this.insert(record)
  }

  replace(record) {
    return super.replace(record).then(result=>{
      this.touch(this.indexIn(record))
      return result
    })
  }

  remove(recordOrIndex) {
    let index
    if (typeof recordOrIndex === "string") index = recordOrIndex
    else index = this.indexIn(recordOrIndex)
    return super.remove(recordOrIndex).then(result=>{
      delete this._touched[index]
      return result
    })
  }
}
