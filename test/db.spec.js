const db = require('../db/pg')
const expect = require('chai').expect

describe('db', () => {
  it('should connect to PostgreSQL db', async () => {
    const result = await db.query('SELECT NOW()')
    expect(result.rows).to.be.an('array')
    expect(result.rows.length).to.equal(1)
  })
})
