const expect = require('chai').expect
const request = require('supertest')
const R = require('ramda')
const db = require('../../db/pg')
const server = require('../../server/index')
const isValidReport = require('../../src/report/model').isValid

const sampleReports = require('../../db/sample-reports').reports
const sampleOfficers = require('../../db/sample-officers').officers

function clearOfficersTable () {
  return db.query(`DELETE FROM officers`)
}
function addOfficer ({ name }) {
  return db.query(`INSERT INTO officers (name) VALUES ($1) RETURNING id`, [name])
}

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
          ($1, $2, $3, $4, $5, $6)
        RETURNING id`,
    [
      description, license_number, color, type, owner_full_name, associate_officer_id
    ])
}
function findAll () {
  return db.query('SELECT * FROM reports ORDER BY id')
}
function findReport (id) {
  return db.query('SELECT * FROM reports WHERE id = $1 ORDER BY id', [id])
}

const omitAutomatics =
  R.omit([
    'id',
    'associate_officer_id',
    'date_of_submit',
    'date_of_theft',
    'is_resolved',
    'associate_officer'
  ])
const omitOfficerFields = R.omit(['associate_officer', 'associate_officer_id'])
const omitAutomaticsFromAll = R.map(omitAutomatics)

describe('reports end point at /reports', function () {
  beforeEach(async function () {
    await Promise.all([
      clearOfficersTable(),
      clearReportsTable()])
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

  it('DELETE /reports/:id > should remove report with that given id', async function () {
    const seedReport = sampleReports[0]
    const seedReport2 = sampleReports[1]
    const seedReport3 = sampleReports[2]

    await addReport(seedReport)
    await addReport(seedReport2)
    await addReport(seedReport3)

    const idOfReportToBeRemoved = (await findAll()).rows[1].id

    await request(server)
      .delete('/reports/' + idOfReportToBeRemoved)
      .expect(200)
      .expect('Content-Type', 'text/plain; charset=utf-8')
      .expect(res => {
        const returnedData = res.body
        expect(returnedData).to.deep.equal({})
      })
  })

  it('POST /reports > should add a report', async function () {
    const reportToBeAddedInfo = sampleReports[2]

    await request(server)
      .post('/reports')
      .send(reportToBeAddedInfo)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => {
        const returnedData = res.body
        expect(returnedData.id).to.be.above(0)
      })
  })

  it('PUT /reports/:id > should update info for report with given id', async function () {
    const seedReport = sampleReports[0]
    const seedReport2 = sampleReports[1]
    const seedReport3 = sampleReports[2]

    await addReport(seedReport)
    await addReport(seedReport2)
    await addReport(seedReport3)

    const idOfReportToBeEdited = (await findAll()).rows[1].id

    await request(server)
      .put('/reports/' + idOfReportToBeEdited)
      .send(R.mergeRight(seedReport2, { description: 'new description', color: 'new color' }))
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => {
        const returnedData = res.body
        expect(returnedData).to.deep.equal({})
      })

    const editedReportData = await findReport(idOfReportToBeEdited)
    expect(editedReportData.rows[0].description).to.equal('new description')
    expect(editedReportData.rows[0].color).to.equal('new color')
  })

  it('GET /reports/:id > should return correct info for report with given id', async function () {
    const seedReport = sampleReports[0]
    const seedReport2 = sampleReports[1]
    const seedReport3 = sampleReports[2]

    await addReport(seedReport)
    await addReport(seedReport2)
    await addReport(seedReport3)

    const reportToBeQueried = (await findAll()).rows[1]

    await request(server)
      .get('/reports/' + reportToBeQueried.id)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => {
        const convertDateToString = (date) => date.toISOString()
        const convertDates = R.evolve({
          date_of_submit: convertDateToString,
          date_of_theft: convertDateToString
        })
        expect(
          omitOfficerFields(res.body))
          .to.deep.equal(
            omitOfficerFields(convertDates(reportToBeQueried)))
      })
  })

  it('should return empty array when query is sent but nothing matches the query', async function () {
    const seedReport = sampleReports[0]
    const seedReport2 = sampleReports[1]
    const seedReport3 = sampleReports[2]

    await addReport(seedReport)
    await addReport(seedReport2)
    await addReport(seedReport3)

    await request(server)
      .get('/reports')
      .query({ type: 'new-type' })
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => {
        expect(res.body).to.deep.equal([])
      })
  })

  it('should filter reports given filter constraints', async function () {
    const seedReport = sampleReports[0]
    const seedReport2 = sampleReports[1]
    const seedReport3 = sampleReports[2]

    await addReport(seedReport)
    await addReport(seedReport2)
    await addReport(seedReport3)

    const reportToBeQueried = (await findAll()).rows[1]

    await request(server)
      .get('/reports')
      .query({ type: reportToBeQueried.type, color: reportToBeQueried.color })
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => {
        expect(res.body[0] && res.body[0].id).to.equal(reportToBeQueried.id)
      })

    await request(server)
      .get('/reports')
      .query({ description: 'broken' })
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => {
        expect(res.body[0] && res.body[0].id).to.equal(reportToBeQueried.id)
      })
  })

  it('should filter reports given filter constraints (case-insensitive)', async function () {
    const seedReport = sampleReports[0]
    const seedReport2 = sampleReports[1]
    const seedReport3 = sampleReports[2]

    await addReport(seedReport)
    await addReport(seedReport2)
    await addReport(seedReport3)

    const reportToBeQueried = (await findAll()).rows[1]

    await request(server)
      .get('/reports')
      .query({
        type: R.toUpper(reportToBeQueried.type),
        color: R.toUpper(reportToBeQueried.color)
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => {
        expect(res.body[0] && res.body[0].id).to.equal(reportToBeQueried.id)
      })

    await request(server)
      .get('/reports')
      .query({ description: 'BROKEN' })
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => {
        expect(res.body[0] && res.body[0].id).to.equal(reportToBeQueried.id)
      })
  })

  it('should return associate officer detail', async function () {
    const seedReport = sampleReports[0]
    const seedReport2 = sampleReports[1]
    const seedReport3 = sampleReports[2]
    const seedOfficer = sampleOfficers[0]
    const seedOfficer2 = sampleOfficers[1]

    const officerId = (await addOfficer(seedOfficer)).rows[0].id
    await Promise.all([
      addOfficer(seedOfficer2),
      addReport(seedReport2),
      addReport(seedReport3)
    ])

    const reportId =
      (await addReport(
        R.mergeRight(
          seedReport, {
            associate_officer_id: officerId
          }))).rows[0].id

    await db.query(
      `UPDATE officers set current_case_id = $1 WHERE id = $2`,
      [reportId, officerId])

    await request(server)
      .get('/reports/' + reportId)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => {
        expect(res.body.associate_officer.id).to.equal(officerId)
        expect(res.body.associate_officer.name).to.equal(seedOfficer.name)
      })

    await request(server)
      .get('/reports')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => {
        const changedReport = res.body.find(report => report.id === reportId)

        expect(changedReport.associate_officer.id).to.equal(officerId)
        expect(changedReport.associate_officer.name).to.equal(seedOfficer.name)
      })
  })

  it('POST /reports/:id/resolve should resolve report',
    async function () {
      const seedReport = sampleReports[0]
      const reportId =
        (await addReport(seedReport))
          .rows[0].id

      await request(server)
        .post(`/reports/${reportId}/resolve`)
        .expect(200)
        .expect('Content-Type', 'text/plain; charset=utf-8')
        .expect(res => {
          const returnedData = res.body
          expect(returnedData).to.deep.equal({})
        })

      const reports = await findAll()
      expect(reports.rows[0].id).to.equal(reportId)
      expect(reports.rows[0].is_resolved).to.equal(true)
    })

  after(async function () {
    await clearReportsTable()
  })
})
