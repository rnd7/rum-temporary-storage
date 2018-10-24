import { Storage } from '@rnd7/rum-storage'
console.log(Storage)

export const TEMPORARY_STORAGE_DEFAULTS = {
  scheduler: true,
  ttl: 1000*60*60*24,
  minWipeInterval: 1000*60,
  touchOnFind: true,
  touchOnList: true
}

export class TemporaryStorage extends Storage {
    constructor(opts) {
      super(opts)
    }

    _init() {
      super._init()
      this._touched = {}
      this._wipe = this.wipe.bind(this)
      this._scheduled
      this._nextWipe
      this._lastWipe
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
      if (this._nextWipe > time) {
        const now = Date.now()
        this._nextWipe = Math.max(this._lastWipe + this.minWipeInterval, time)
        if (this._scheduled)
          this._scheduled = clearTimeout(this._scheduled)
        if (this._nextWipe < Number.MAX_SAFE_INTEGER) {
          this._scheduled = setTimeout(this._wipe, this._nextWipe - now)
        }
      }
    }

    wipe() {
      const limit = Date.now() - this.ttl
      let next = Number.MAX_SAFE_INTEGER
      for (let sid in this._touched) {
        let t = this._touched[sid]
        if (t <= limit) this.remove(sid)
        else if (t<next) next = t
      }
      this._lastWipe = now
      this.schedule(next + this.ttl)
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
