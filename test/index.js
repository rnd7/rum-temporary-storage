import assert from 'assert'
import { TemporaryStorage } from '../src/index.js'

const TEST_SID = '123'
const TEST_DATA = {
  sid: TEST_SID,
  someBoolean: true,
  someNumber: 1.234,
  someString: "My Text",
  someArray:[1,2,3],
  someObject:{ isNested: true },
}

describe('Rumbullion Temporary Storage', () => {
  let storage
  describe('instantiation', () => {
    it('constructor', () => {
      storage = new TemporaryStorage()
    })
    it('should be instance of Storage', () => {
      assert.equal(true, storage instanceof TemporaryStorage)
    })
  })
  describe('insert', () => {
    let promise
    it('should return a Promise', () => {
      promise = storage.insert(TEST_DATA)
      assert.equal(true, promise instanceof Promise)
    })
    it('the promise should resolve with a object that equal the test data', (done)=>{
      promise.then(
        (result) => {
          assert.equal(true, JSON.stringify(result) === JSON.stringify(TEST_DATA))
        }
      ).finally(done)
    })
  })

  describe('find', () => {
    let promise
    it('should return a Promise', () => {
      promise = storage.find(TEST_SID)
      assert.equal(true, promise instanceof Promise)
    })
    it('the promise should resolve with a object that equal the test data', (done)=>{
      promise.then(
        (result) => {
          assert.equal(true, JSON.stringify(result) === JSON.stringify(TEST_DATA))
        }
      ).finally(done)
    })
  })

  describe('list', () => {
    let promise
    it('should return a Promise', () => {
      promise = storage.list()
      assert.equal(true, promise instanceof Promise)
    })
    it('the Promise should resolve with an array containg only the test sid', (done)=>{
      promise.then(
        (result) => {
          assert.equal(true, result.length == 1 && result[0] === TEST_SID )
        }
      ).finally(done)
    })
  })

  const UPDATE_DATA = {
    sid: TEST_SID,
    someNewProperty: "from update",
    someString: "My updated Text",
  }
  describe('update', () => {
    let promise
    it('should return a Promise', () => {
      promise = storage.update(UPDATE_DATA)
      assert.equal(true, promise instanceof Promise)
    })
    let object
    it('the Promise should resolve with an object', (done)=>{
      promise.then(
        (result) => {
          object = result
          assert.equal(true, typeof(result) === "object" )
        }
      ).finally(done)
    })
    it('the object should contain a property someNewProperty', () => {
      assert.equal(true, object.hasOwnProperty("someNewProperty"))
    })
    it('the property someString should have been updated', () => {
      assert.equal(true, object.someString === UPDATE_DATA.someString)
    })
  })


  const UPSERT_SID = '456'
  const UPSERT_DATA = {
    sid: UPSERT_SID,
    anotherProperty: true,
  }
  describe('upsert', () => {
    let promise
    it('should return a Promise', () => {
      promise = storage.upsert(UPSERT_DATA)
      assert.equal(true, promise instanceof Promise)
    })
    it('the promise should resolve with a object that equals the upsert data', (done)=>{
      promise.then(
        (result) => {
          assert.equal(true, JSON.stringify(result) === JSON.stringify(UPSERT_DATA))
        }
      ).finally(done)
    })

  })

  const UPSERT_UPDATE_DATA = {
    sid: UPSERT_SID,
    yetAnotherProperty: "from upsert update",
  }
  describe('upsert with existing sid', () => {
    let promise
    it('should return a Promise', () => {
      promise = storage.upsert(UPSERT_UPDATE_DATA)
      assert.equal(true, promise instanceof Promise)
    })
    let object
    it('the promise should resolve with the updated object', (done)=>{
      promise.then(
        (result) => {
          object = result
          assert.equal(true, typeof(result) === "object" )
        }
      ).finally(done)
    })
    it('the object should contain the property from the previous upsert', () => {
      assert.equal(true, object.hasOwnProperty("anotherProperty"))
    })
    it('the object should also contain a property from the current upsert', () => {
      assert.equal(true, object.hasOwnProperty("yetAnotherProperty"))
    })
  })

  describe('list after upsert', () => {
    let promise
    it('should return a Promise', () => {
      promise = storage.list()
      assert.equal(true, promise instanceof Promise)
    })
    it('the Promise should resolve with an array containg the test sid', (done)=>{
      promise.then(
        (result) => {
          assert.equal(true, result.length == 2 && result.includes(TEST_SID) && result.includes(UPSERT_SID) )
        }
      ).finally(done)
    })
  })

  const REPLACE_DATA = {
    sid: UPSERT_SID,
    theOnlyProperty: "from replace",
  }
  describe('replace', () => {
    let promise
    it('should return a Promise', () => {
      promise = storage.replace(REPLACE_DATA)
      assert.equal(true, promise instanceof Promise)
    })
    let object
    it('the promise should resolve with the replaced object', (done)=>{
      promise.then(
        (result) => {
          object = result
          assert.equal(true, typeof(result) === "object" )
        }
      ).finally(done)
    })
    it('the object should equal the replacement_data', () => {
      assert.equal(true,  JSON.stringify(object) === JSON.stringify(REPLACE_DATA))
    })
  })

  describe('find replaced', () => {
    let promise
    it('should return a Promise', () => {
      promise = storage.find({sid: UPSERT_SID})
      assert.equal(true, promise instanceof Promise)
    })
    it('the promise should resolve with a object that equal the replacement data', (done)=>{
      promise.then(
        (result) => {
          assert.equal(true, JSON.stringify(result) === JSON.stringify(REPLACE_DATA))
        }
      ).finally(done)
    })
  })

  describe('remove', () => {
    let promise
    it('should return a Promise', () => {
      promise = storage.remove({sid: UPSERT_SID})
      assert.equal(true, promise instanceof Promise)
    })
    it('the promise should resolve with the removed object that equals the replacement data', (done)=>{
      promise.then(
        (result) => {
          assert.equal(true, JSON.stringify(result) === JSON.stringify(REPLACE_DATA))
        }
      ).finally(done)
    })
  })

  describe('find removed', () => {
    let promise
    it('should return a Promise', () => {
      promise = storage.find({sid: UPSERT_SID}).catch(()=>{})
      assert.equal(true, promise instanceof Promise)
    })
    it('the promise should reject with some error', (done)=>{
      promise.catch(
        (error) => {
          assert.equal(true, !!error)
        }
      ).finally(done)
    })
  })

  describe('list after remove', () => {
    let promise
    it('should return a Promise', () => {
      promise = storage.list()
      assert.equal(true, promise instanceof Promise)
    })
    it('the Promise should resolve with an array containg the test sid', (done)=>{
      promise.then(
        (result) => {
          assert.equal(true, result.length == 1 && result.includes(TEST_SID) )
        }
      ).finally(done)
    })
  })
})

/*

it('resolves', (done) => {
  resolvingPromise.then( (result) => {
    expect(result).to.equal('promise resolved');
  }).finally(done);
});

  assert.equal(true, storage._cache === Object(storage._cache))*/
