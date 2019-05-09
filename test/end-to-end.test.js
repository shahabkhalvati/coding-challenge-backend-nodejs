const expect = require('chai').expect
const request = require('supertest')
const server = require('../server/index')
const db = require('../db/pg')
const common = require('../bin/common')

const sampleOfficers = require('../db/sample-officers').officers
const sampleReports = require('../db/sample-reports').reports

function clearOfficersTable () {
  return db.query(`DELETE FROM officers`)
}
function clearReportsTable () {
  return db.query(`DELETE FROM reports`)
}

describe('end-to-end test', async function () {
  beforeEach(async function () {
    await clearOfficersTable()
    await clearReportsTable()
  })

  it('should add officers and reports, and assign reports to officers', async function () {
    await request(server)
      .post('/officers')
      .send(sampleOfficers[0])
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => {
        const returnedData = res.body
        expect(returnedData.id).to.be.above(0)
      })
    await request(server)
      .post('/officers')
      .send(sampleOfficers[1])
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => {
        const returnedData = res.body
        expect(returnedData.id).to.be.above(0)
      })
    await request(server)
      .post('/officers')
      .send(sampleOfficers[2])
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => {
        const returnedData = res.body
        expect(returnedData.id).to.be.above(0)
      })
    await request(server)
      .get('/officers')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => {
        const returnedData = res.body
        expect(returnedData.length).to.be.equal(3)
        expect(
          returnedData.filter(
            officer => !common.isNilOrEmpty(officer.current_case_id)
          )).to.deep.equal([])
      })
    await request(server)
      .post('/reports')
      .send(sampleReports[0])
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => {
        const returnedData = res.body
        expect(returnedData.id).to.be.above(0)
      })
    await request(server)
      .get('/officers')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => {
        const returnedData = res.body
        expect(returnedData.length).to.be.equal(3)
        expect(
          returnedData.filter(
            officer => !common.isNilOrEmpty(officer.current_case_id)
          ).length).to.equal(1)
      })
    await request(server)
      .post('/reports')
      .send(sampleReports[1])
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => {
        const returnedData = res.body
        expect(returnedData.id).to.be.above(0)
      })
    await request(server)
      .get('/officers')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => {
        const returnedData = res.body
        expect(returnedData.length).to.be.equal(3)
        expect(
          returnedData.filter(
            officer => !common.isNilOrEmpty(officer.current_case_id)
          ).length).to.equal(2)
      })
    await request(server)
      .post('/reports')
      .send(sampleReports[2])
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => {
        const returnedData = res.body
        expect(returnedData.id).to.be.above(0)
      })
    await request(server)
      .get('/officers')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => {
        const returnedData = res.body
        expect(returnedData.length).to.be.equal(3)
        expect(
          returnedData.filter(
            officer => !common.isNilOrEmpty(officer.current_case_id)
          ).length).to.equal(3)
      })
    await request(server)
      .post('/reports')
      .send(sampleReports[3])
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => {
        const returnedData = res.body
        expect(returnedData.id).to.be.above(0)
      })
    await request(server)
      .get('/officers')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => {
        const returnedData = res.body
        expect(returnedData.length).to.be.equal(3)
        expect(
          returnedData.filter(
            officer => !common.isNilOrEmpty(officer.current_case_id)
          ).length).to.equal(3)
      })
    let idOfOnePendingReport = 0
    await request(server)
      .get('/reports')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => {
        const returnedData = res.body
        expect(returnedData.length).to.be.equal(4)
        expect(
          returnedData.filter(
            report => common.isNilOrEmpty(report.associate_officer)
          ).length).to.equal(1)

        idOfOnePendingReport = returnedData
          .find(report => (!report.is_resolved) && (report.associate_officer !== null))
          .id
      })

    await request(server)
      .post('/reports/' + idOfOnePendingReport + '/resolve')
      .expect(200)

    await request(server)
      .get('/officers')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => {
        const returnedData = res.body
        expect(returnedData.length).to.be.equal(3)
        expect(
          returnedData.filter(
            officer => !common.isNilOrEmpty(officer.current_case_id)
          ).length).to.equal(3)
      })

    let pendingReports = null
    await request(server)
      .get('/reports')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => {
        const returnedData = res.body
        expect(returnedData.length).to.be.equal(4)
        expect(
          returnedData.filter(
            report => common.isNilOrEmpty(report.associate_officer)
          ).length).to.equal(0)

        pendingReports = returnedData
          .filter(report => (!report.is_resolved) && (report.associate_officer !== null))
          .map(report => report.id)
      })

    await Promise.all(
      pendingReports.map(
        reportId => request(server).post('/reports/' + reportId + '/resolve'))
    )

    await request(server)
      .get('/officers')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => {
        const returnedData = res.body
        expect(returnedData.length).to.be.equal(3)

        expect(
          returnedData.filter(
            officer => !common.isNilOrEmpty(officer.current_case_id)
          ).length).to.equal(0)

        expect(
          returnedData.filter(
            officer => common.isNilOrEmpty(officer.current_case_id)
          ).length).to.equal(3)
      })

    await request(server)
      .get('/reports')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => {
        const returnedData = res.body

        expect(returnedData.length).to.be.equal(4)

        expect(
          returnedData.filter(
            report => common.isNilOrEmpty(report.associate_officer)
          ).length).to.equal(0)

        expect(
          returnedData.filter(
            report => report.is_resolved
          ).length).to.equal(4)
      })
  })

  after(async function () {
    await clearOfficersTable()
    await clearReportsTable()
  })
})
