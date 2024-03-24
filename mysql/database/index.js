const db = require('../index')
db.script(
  () => db.createDatabase('rest'),
  () => db.dropDatabase('rest')
)
