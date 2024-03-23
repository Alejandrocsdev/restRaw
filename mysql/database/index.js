const { createDatabase, dropDatabase } = require('../index')

// function script(up, down) {
//   const args = process.argv.slice(2)
//   if (args.length !== 1 || !['up', 'down'].includes(args[0])) {
//     console.error('Usage: node script.js <up|down>')
//     process.exit(1)
//   }
//   const command = args[0]
//   if (command === 'up') {
//     up
//   } else if (command === 'down') {
//     down
//   }
// }

const args = process.argv.slice(2)
if (args.length !== 1 || !['up', 'down'].includes(args[0])) {
  console.error('Usage: node script.js <up|down>')
  process.exit(1)
}
const command = args[0]
if (command === 'up') {
  createDatabase('rest')
} else if (command === 'down') {
  dropDatabase('rest')
}
