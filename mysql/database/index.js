const db = require('../index')

const args = process.argv.slice(2)
if (args.length !== 1 || !['up', 'down'].includes(args[0])) {
  console.error('Usage: node script.js <up|down>')
  process.exit(1)
}
const command = args[0]
if (command === 'up') {
  db.createDatabase('rest')
} else if (command === 'down') {
  db.dropDatabase('rest')
}
