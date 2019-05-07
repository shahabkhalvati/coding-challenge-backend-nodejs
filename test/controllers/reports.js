const expect = require('chai').expect
const request = require('supertest')
const R = require('ramda')
const db = require('../../db/pg')
const server = require('../../server/index')
const isValidReport = require('../../src/report/model').isValid

const sampleReports = require('../../db/sample-reports').reports

function clearReportsTable () {
  return db.query(`DELETE FROM reports`)
}
function addReport ({
  description,
  license_number,
  color,
  type,
  owner_full_name,
  associate_officer_id
}) {
  return db.query(
    `INSERT INTO reports
      (description, license_number, color, type, owner_full_name, associate_officer_id)
        VALUES
          ($1, $2, $3, $4, $5, $6)`,
    [
      description, license_number, color, type, owner_full_name, associate_officer_id
    ])
}
function findAll () {
  return db.query('SELECT * FROM reports')
}
// function findReport (id) {
//   return db.query('SELECT * FROM reports WHERE id = $1', [id])
// }

const omitAutomatics =
  R.omit([
    'id', 'associate_officer_id', 'date_of_submit', 'date_of_theft', 'is_resolved'
  ])
const omitAutomaticsFromAll = R.map(omitAutomatics)

describe('reports end point at /reports', function () {
  beforeEach(async function () {
    await clearReportsTable()
  })

  it('GET  /reports > should return all reports', async function () {
    const seedReport = sampleReports[0]
    const seedReport2 = sampleReports[1]
    const seedReport3 = sampleReports[2]

    await addReport(seedReport)
    await addReport(seedReport2)
    await addReport(seedReport3)

    await request(server)
      .get('/reports')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => {
        const returnedData = res.body
        expect(R.all(isValidReport)(returnedData)).to.equal(true)
        expect(omitAutomaticsFromAll(returnedData)).to.deep.equal([
          seedReport, seedReport2, seedReport3])
      })
  })

  after(async function () {
    await clearReportsTable()
  })
})
