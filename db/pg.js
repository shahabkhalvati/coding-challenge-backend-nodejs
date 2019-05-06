const config = require('../config/db')
const pg = require('pg')

const pool = new pg.Pool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
})

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  }
}
