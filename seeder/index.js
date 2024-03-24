const db = require('../mysql')
const restaurants = require('../seeder/restaurants.json')
db.script(
  () => db.bulkInsert('rests', restaurants.results),
  () => db.bulkDelete('rests')
)
