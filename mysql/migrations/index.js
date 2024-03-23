const { createTable, dropTable } = require('../index')
// up
const columns = `${tableColumn('id', 'INT', 'NOT NULL', 'PRIMARY KEY', undefined, 'AUTO_INCREMENT')},
${tableColumn('name', 'VARCHAR(255)', 'NOT NULL', undefined, `DEFAULT 'test'`)},
${tableColumn('name_en', 'VARCHAR(255)', 'NOT NULL', undefined, `DEFAULT 'test'`)},
${tableColumn('category', 'VARCHAR(255)', 'NOT NULL', undefined, `DEFAULT 'test'`)},
${tableColumn('image', 'VARCHAR(255)', 'NOT NULL', undefined, `DEFAULT 'test'`)},
${tableColumn('location', 'VARCHAR(255)', 'NOT NULL', undefined, `DEFAULT 'test'`)},
${tableColumn('phone', 'VARCHAR(255)', 'NOT NULL', undefined, `DEFAULT 'test'`)},
${tableColumn('google_map', 'VARCHAR(255)', 'NOT NULL', undefined, `DEFAULT 'test'`)},
${tableColumn('rating', 'VARCHAR(255)', 'NOT NULL', undefined, `DEFAULT 'test'`)},
${tableColumn('description', 'VARCHAR(255)', 'NOT NULL', undefined, `DEFAULT 'test'`)},
${tableColumn('createdAt', 'DATETIME', 'NOT NULL', undefined, 'DEFAULT CURRENT_TIMESTAMP')},
${tableColumn('updatedAt', 'DATETIME', 'NOT NULL', undefined, 'DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')}`
// createTable('rests', columns)

function tableColumn(Field, Type, Null, Key, Default, Extra) {
  Null = Null === undefined ? '' : ` ${Null}`
  Key = Key === undefined ? '' : ` ${Key}`
  Default = Default === undefined ? '' : ` ${Default}`
  Extra = Extra === undefined ? '' : ` ${Extra}`
  return `${Field} ${Type}${Null}${Key}${Default}${Extra}`
}
// down
// dropTable('rests')

const args = process.argv.slice(2)
if (args.length !== 1 || !['up', 'down'].includes(args[0])) {
  console.error('Usage: node script.js <up|down>')
  process.exit(1)
}
const command = args[0]
if (command === 'up') {
  createTable('rests', columns)
} else if (command === 'down') {
  dropTable('rests')
}