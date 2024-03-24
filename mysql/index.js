const mysql = require('mysql2')
const fs = require('fs')
const env = require('./config/config.json')

class Mysql {
  constructor(env) {
    this.connection = mysql.createConnection(env)
  }
  createDatabase(name) {
    this.connection.query(`CREATE DATABASE IF NOT EXISTS ${name}`, (err) => {
      if (err) {
        console.log('Fail to create database: ' + err)
        return
      }
      this.database(env, name, 'create')
      console.log(`Database '${name}' created successfully`)
    })
  }

  dropDatabase(name) {
    this.connection.query(`DROP DATABASE IF EXISTS ${name}`, (err) => {
      if (err) {
        console.log('Fail to drop database: ' + err)
        return
      }
      this.database(env, name, 'drop')
      console.log(`Database '${name}' dropped successfully`)
    })
  }

  database(env, name, type) {
    if (type === 'create') {
      env.database = name
    } else if (type === 'drop') {
      delete env.database
    }
    fs.writeFileSync(`${__dirname}/./config/config.json`, JSON.stringify(env))
  }

  createTable(name, columns) {
    this.connection.query(`CREATE TABLE IF NOT EXISTS ${name} (${columns})`, (err) => {
      if (err) {
        console.log('Fail to create table: ' + err)
        return
      }
      console.log(`Table '${name}' created successfully`)
    })
  }

  dropTable(name) {
    this.connection.query(`DROP TABLE IF EXISTS ${name}`, (err) => {
      if (err) {
        console.log('Fail to drop table: ' + err)
        return
      }
      console.log(`Table '${name}' dropped successfully`)
    })
  }

  bulkInsert(name, fields) {
    fields['id'] ? delete obj['id'] : fields
    const field = String(Object.keys(fields[0]))
    let values = ''
    fields.forEach((row) => {
      values += `('${Object.values(row).join("','")}'),`
    })
    values = values.slice(0, -1) + ';'
    this.connection.query(`INSERT INTO ${name} (${field}) VALUES ${values}`, (err) => {
      if (err) {
        console.log('Fail to bulk insert rows: ' + err)
        return
      }
      console.log(`Values bulk inserted into '${name}' table successfully`)
    })
  }

  bulkDelete(name) {
    this.connection.query(`DELETE FROM ${name};`, (err) => {
      if (err) {
        console.log('Fail to delete rows: ' + err)
        return
      }
      console.log(`Values bulk deleted from '${name}' table successfully`)
    })
  }

  insertRow(name, fields) {
    const field = String(Object.keys(fields))
    // let value = `\'${Object.values(fields).join("\',\'")}\'`
    const value = Object.values(fields).map(value => this.connection.escape(value)).join(',')
    this.connection.query(`INSERT INTO ${name} (${field}) VALUES (${value});`, (err) => {
      if (err) {
        console.log('Fail to insert row: ' + err)
        return
      }
      console.log(`Value inserted into '${name}' table successfully`)
    })
  }

  updateRow(name, fields, id) {

    const row = Object.entries(fields)
    .map(([key, value]) => `${this.connection.escapeId(key)} = ${this.connection.escape(value)}`)
    .join(',')

    this.connection.query(`UPDATE ${name} SET ${row} WHERE id = ${id};`, (err) => {
      if (err) {
        console.log('Fail to update row: ' + err)
        return
      }
      console.log(`Value from '${name}' table updated successfully`)
    })
  }

  deleteRow(name, id) {
    this.connection.query(`DELETE FROM ${name} WHERE id = ${id};`, (err) => {
      if (err) {
        console.log('Fail to delete row: ' + err)
        return
      }
      console.log(`Value deleted from '${name}' table successfully`)
    })
  }

  async select(name) {
    return new Promise((resolve, reject) => {
      this.connection.query(`SELECT * FROM ${name};`, (err, results) => {
        if (err) {
          console.log('Fail to select table: ' + err)
          reject(err)
          return
        }
        console.log(`Select from '${name}' table successfully`)
        resolve(results)
      })
    })
  }

  async getData(name) {
    try {
      const results = await this.select(name)
      return results
    } catch (err) {
      console.error(err)
      return null
    }
  }
}

const db = new Mysql(env)

module.exports = db
