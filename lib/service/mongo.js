'use strict'
const limbo = require('limbo')
const config = require('config')
const mongoose = require('mongoose')

mongoose.Promise = Promise
const conn = mongoose.createConnection(config.db_url, {
  promiseLibrary: Promise
})

conn.on('error', function (err) {
  if (err.code === 'ENETUNREACH') {
    throw err
  }
})
const p = limbo.use('anmoyi', {
  conn: conn
})
p.loadSchemas(require('../schema')(mongoose.Schema))

module.exports = limbo
