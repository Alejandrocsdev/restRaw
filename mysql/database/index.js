const mysql = require('mysql2')
const fs = require('fs')
const env = require('../config/config.json')
const connection = mysql.createConnection(env)

function createDatabase(name) {
  connection.query(`CREATE DATABASE IF NOT EXISTS ${name}`, (err, results, fields) => {
    if (err) {
      console.log('Fail to create database: ' + err)
      return
    }
    database(env, name, 'create')
    console.log(`Database '${name}' created successfully`)
  })
}

function dropDatabase(name) {
  connection.query(`DROP DATABASE ${name}`, (err, results, fields) => {
    if (err) {
      console.log('Fail to drop database: ' + err)
      return
    }
    database(env, name, 'drop')
    console.log(`Database '${name}' dropped successfully`)
  })
}

function database(env, name, type) {
  if (type === 'create') {
    env.database = name
  } else if (type === 'drop') {
    delete env.database
  }
  fs.writeFileSync(`${__dirname}/../config/config.json`, JSON.stringify(env))
}

module.exports = { createDatabase, dropDatabase }
