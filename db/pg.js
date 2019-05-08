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
  },
  inTransaction: async function (callback) {
    const client = await pool.connect()

    try {
      await client.query('BEGIN')
      const finalResult = await callback(client)
      await client.query('COMMIT')

      return finalResult
    } catch (e) {
      await client.query('ROLLBACK')
      throw e
    } finally {
      client.release()
    }
  }
}
