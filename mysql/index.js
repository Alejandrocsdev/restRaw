const mysql = require('mysql2')
const fs = require('fs')
const env = require('./config/config.json')
const connection = mysql.createConnection(env)

function createDatabase(name) {
  connection.query(`CREATE DATABASE IF NOT EXISTS ${name}`, (err) => {
    if (err) {
      console.log('Fail to create database: ' + err)
      return
    }
    database(env, name, 'create')
    console.log(`Database '${name}' created successfully`)
  })
}

function dropDatabase(name) {
  connection.query(`DROP DATABASE IF EXISTS ${name}`, (err) => {
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
  fs.writeFileSync(`${__dirname}/./config/config.json`, JSON.stringify(env))
}

function createTable(name, columns) {
  connection.query(`CREATE TABLE IF NOT EXISTS ${name} (${columns})`, (err) => {
    if (err) {
      console.log('Fail to create table: ' + err)
      return
    }
    console.log(`Table '${name}' created successfully`)
  })
}

function dropTable(name) {
  connection.query(`DROP TABLE IF EXISTS ${name}`, (err) => {
    if (err) {
      console.log('Fail to drop table: ' + err)
      return
    }
    console.log(`Table '${name}' dropped successfully`)
  })
}

function insertRows(name, fields) {
  const field = String(Object.keys(fields[0]))
  let values = ''
  fields.forEach((row)=>{
    values += `('${Object.values(row).join("','")}'),`
  })
  values = values.slice(0, -1) + ';'
  connection.query(`INSERT INTO ${name} (${field}) VALUES ${values}`, (err) => {
    if (err) {
      console.log('Fail to insert rows: ' + err)
      return
    }
    console.log(`Values inserted into '${name}' table successfully`)
  })
}

function deleteRows(name) {
  connection.query(`DELETE FROM ${name};`, (err) => {
    if (err) {
      console.log('Fail to delete rows: ' + err)
      return
    }
    console.log(`Values deleted from '${name}' table successfully`)
  })
}

module.exports = { createDatabase, dropDatabase, createTable, dropTable, insertRows, deleteRows }
