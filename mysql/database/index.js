const db = require('..')
const { database } = require('../../app')
db.script(
  () => db.createDatabase(database),
  () => db.dropDatabase(database)
)
