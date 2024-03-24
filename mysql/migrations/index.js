const db = require('../index')
const columns = `${tableColumn(
  'id',
  'INT',
  'NOT NULL',
  'PRIMARY KEY',
  undefined,
  'AUTO_INCREMENT'
)},
${tableColumn('name', 'VARCHAR(255)', 'NOT NULL')},
${tableColumn('name_en', 'VARCHAR(255)', 'NOT NULL')},
${tableColumn('category', 'VARCHAR(255)', 'NOT NULL')},
${tableColumn('image', 'VARCHAR(255)', 'NOT NULL')},
${tableColumn('location', 'VARCHAR(255)', 'NOT NULL')},
${tableColumn('phone', 'VARCHAR(255)', 'NOT NULL')},
${tableColumn('google_map', 'VARCHAR(255)', 'NOT NULL')},
${tableColumn('rating', 'VARCHAR(255)', 'NOT NULL')},
${tableColumn('description', 'VARCHAR(255)', 'NOT NULL')},
${tableColumn('createdAt', 'DATETIME', 'NOT NULL', undefined, 'DEFAULT CURRENT_TIMESTAMP')},
${tableColumn(
  'updatedAt',
  'DATETIME',
  'NOT NULL',
  undefined,
  'DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
)}`

function tableColumn(Field, Type, Null, Key, Default, Extra) {
  Null = Null === undefined ? '' : ` ${Null}`
  Key = Key === undefined ? '' : ` ${Key}`
  Default = Default === undefined ? '' : ` ${Default}`
  Extra = Extra === undefined ? '' : ` ${Extra}`
  return `${Field} ${Type}${Null}${Key}${Default}${Extra}`
}

db.script(
  () => db.createTable('rests', columns),
  () => db.dropTable('rests')
)
