# Rumbullion Temporary Storage
Temporary Storage Class used within the Rumbullion toolkit. Data stored will timeout after a given period of time when not changed or at least listed.

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
<script src="node_modules/@rnd7/rum-temporary-storage/dist/rum-temporary-storage-browser.js"></script>
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

You might also pass all [Storage](https://github.com/rnd7/rum-storage) options.

### Inherited from [Storage](https://github.com/rnd7/rum-storage).
```javascript
insert(record)
list()
find(recordOrIndex)
update(record)
upsert(recordOrIndex)
replace(record)
remove(recordOrIndex)
```

### get/set scheduler
The wipe procedure will be invoked automatically when true.
```javascript
scheduler = true || false
```

### schedule
Schedule a wipe manually.
```javascript
schedule(time)
```

### wipe
Wipe all outdated data manually. Usually not necessary.
```javascript
wipe()
```

## Development

### Installation
Install dependencies such as rum-tester, rum-maker and rum-publisher
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

### Publish
Publish to github and npm using
```bash
npx publish-rum -m "My commit message"
```

## License
See the [LICENSE](https://github.com/rnd7/rum-temporary-storage/tree/master/LICENSE.md) file for software license rights and limitations (MIT).
