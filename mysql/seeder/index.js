const db = require('..')
const { table } = require('../../app')
const restaurants = require('../../public/json/restaurants.json')
db.script(
  () => db.bulkInsert(table, restaurants.results),
  () => db.bulkDelete(table)
)
