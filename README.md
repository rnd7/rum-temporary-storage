# Rumbullion Temporary Storage
Temporary Storage Class used within the Rumbullion toolkit.

See also:

[rum](https://github.com/rnd7/rum)

[rum-storage](https://github.com/rnd7/rum-storage)

## Download
[builds](https://github.com/rnd7/rum-temporary-storage/tree/master/dist)

## Installation

```bash
npm i @rnd7/rum-temporary-storage

```
## Include

Via script tag
```
<script src="node_modules/@rnd7/rum-temporary-storage/dist/rum-storage-browser.js"></script>
```

Using require
```javascript
const TemporaryStorage = require('@rnd7/rum-temporary-storage').TemporaryStorage
```

Using import
```javascript
import { TemporaryStorage } from '@rnd7/rum-temporary-storage'
```

## Usage
```javascript
let myStorage = new TemporaryStorage()
let sid = 'someStorageId'
myStorage.insert({sid, myProperty: "myValue"}).then(console.log)
```
## API

### Constructor
Pass optional configuration data as opts parameter assigned directly to the instance.
```javascript
new TemporaryStorage(opts)
```

TemporaryStorage Defaults:
```javascript
{
  scheduler: true,
  ttl: 1000*60*60*24,
  minWipeInterval: 1000*60,
  touchOnFind: true,
  touchOnList: true
}
```

You might also pass all Storage options.

### Inherited from Storage
TemporaryStorage extends Storage.
```javascript
insert(record)
list()
find(recordOrIndex)
update(record)
upsert(recordOrIndex)
replace(record)
remove(recordOrIndex)
```

## Development

### Installation
Install dependencies such as rum-maker and rum-tester
```bash
npm install
```

### Build
Production build
```bash
npm run build
```

### Test
Run Tests
```bash
npm test
```

## License
See the [LICENSE](https://github.com/rnd7/rum-temporary-storage/tree/master/LICENSE.md) file for software license rights and limitations (MIT).
