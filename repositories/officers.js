const R = require('ramda')

const add = (db) => ({ name }) => {
  return db.query(
    `INSERT INTO officers (name) Values ($1)`, [name]
  ).then(result => result.rowCount)
}

const get = (db) => (id) => {
  return db.query(
    `SELECT * FROM officers where id = $1`, [id])
    .then(result => R.head(result.rows))
}
const getAll = (db) => (whereClause = '') => {
  return db.query(
    `SELECT * FROM officers ${whereClause}`)
    .then(result => result.rows)
}

const update = (db) => async (id, data) => {
  const updateFields = R.join(' ')(
    R.keys(data).map(
      (key, index) => `${key} = $${index + 2}`))

  return db.query(
    `UPDATE officers SET ${updateFields} WHERE id=$1`,
    [id, ...R.values(data)]
  ).then(result => result.rowCount)
}

const remove = (db) => async (id) => {
  return db.query(
    `DELETE FROM officers WHERE id = $1`, [id]
  ).then(result => result.rowCount)
}

module.exports = (db = require('../db/pg')) => {
  return {
    add: add(db),
    get: get(db),
    getAll: getAll(db),
    update: update(db),
    remove: remove(db)
  }
}
