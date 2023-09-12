//Module that creates connection with database

let db = null
if (process.env.NODE_ENV === "test") {
  db = require('../../tests/connectTest')
} else {
  db = require('../db/connect-dev')
}

module.exports = db
