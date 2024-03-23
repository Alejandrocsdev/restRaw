const {insertRows, deleteRows} = require('../mysql')
const restaurants = require('../seeder/restaurants.json')

const args = process.argv.slice(2)
if (args.length !== 1 || !['up', 'down'].includes(args[0])) {
  console.error('Usage: node script.js <up|down>')
  process.exit(1)
}
const command = args[0]
if (command === 'up') {
  insertRows('rests', restaurants.results)
} else if (command === 'down') {
  deleteRows('rests')
}
