const fs = require('fs')
const ndjson = require('ndjson')
const levelup = require('levelup')
const leveldown = require('leveldown')
const encode = require('encoding-down')

const db = levelup(encode(leveldown('./db'), { valueEncoding: 'json' }))

fs.createReadStream('data/location_history.ndjson')
  .pipe(ndjson.parse())
  .on('data', async (obj) => {
    db.put(obj.timestampMs, obj)
  })
  .on('end', () => console.log('done'))
