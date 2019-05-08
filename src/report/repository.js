const R = require('ramda')
const dbHelpers = require('../../bin/dbHelpers')

const add = (db) => (data) => {
  const keys = R.keys(data)
  const parameters =
    R.join(
      ', ',
      R.times(
        index => `$${index + 1}`,
        keys.length))

  return db.query(
    `INSERT INTO reports (${R.join(', ')(keys)})
      Values (${parameters})`, R.values(data)
  ).then(result => result.rowCount)
}

const get = (db) => (id) => {
  return db.query(
    `SELECT * FROM reports where id = $1`, [id])
    .then(result => R.head(result.rows))
}
const getAll = (db) => (queryModel = {}) => {
  const usingStrictComparer = false
  const whereClause =
    dbHelpers.orClauseFromModel(usingStrictComparer)(queryModel)
  const clauseParams =
    dbHelpers.clauseParamsFromModel(usingStrictComparer)(queryModel)

  return db.query(
    `SELECT * FROM reports ${whereClause}`, clauseParams)
    .then(result => result.rows)
}

const update = (db) => async (id, data) => {
  const updateFields = R.join(', ')(
    R.keys(data).map(
      (key, index) => `${key} = $${index + 2}`))

  return db.query(
    `UPDATE reports SET ${updateFields} WHERE id=$1`,
    [id, ...R.values(data)]
  ).then(result => result.rowCount)
}

const remove = (db) => async (id) => {
  return db.query(
    `DELETE FROM reports WHERE id = $1`, [id]
  ).then(result => result.rowCount)
}

module.exports = (db = require('../../db/pg')) => {
  return {
    add: add(db),
    get: get(db),
    getAll: getAll(db),
    update: update(db),
    remove: remove(db)
  }
}
