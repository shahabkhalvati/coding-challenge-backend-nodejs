const expect = require('chai').expect
const request = require('supertest')
const R = require('ramda')
const db = require('../../db/pg')
const server = require('../../server/index')
const isValidOfficer = require('../../src/officer/model').isValid

const sampleOfficers = require('../../db/sample-officers').officers

function clearOfficersTable () {
  return db.query(`DELETE FROM officers`)
}
function addOfficer ({ name }) {
  return db.query(`INSERT INTO officers (name) VALUES ($1)`, [name])
}
function findAll () {
  return db.query('SELECT * FROM officers')
}
function findOfficer (id) {
  return db.query('SELECT * FROM officers WHERE id = $1', [id])
}

const omitAutomatics = R.omit(['id', 'current_case_id'])
const omitAutomaticsFromAll = R.map(omitAutomatics)

describe('officers end point at /officers', function () {
  beforeEach(async function () {
    await clearOfficersTable()
  })

  it('GET /officers > should return all officers', async function () {
    const seedOfficer = sampleOfficers[0]
    const seedOfficer2 = sampleOfficers[1]
    const seedOfficer3 = sampleOfficers[2]

    await addOfficer(seedOfficer)
    await addOfficer(seedOfficer2)
    await addOfficer(seedOfficer3)

    await request(server)
      .get('/officers')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => {
        const returnedData = res.body
        expect(R.all(isValidOfficer)(returnedData)).to.equal(true)
        expect(omitAutomaticsFromAll(returnedData)).to.deep.equal([
          seedOfficer, seedOfficer2, seedOfficer3])
      })
  })

  it('DELETE /officers/:id > should remove officers with that given id', async function () {
    const seedOfficer = sampleOfficers[0]
    const seedOfficer2 = sampleOfficers[1]
    const seedOfficer3 = sampleOfficers[2]

    await addOfficer(seedOfficer)
    await addOfficer(seedOfficer2)
    await addOfficer(seedOfficer3)

    const idOfOfficerToBeRemoved = (await findAll()).rows[1].id

    await request(server)
      .delete('/officers/' + idOfOfficerToBeRemoved)
      .expect(200)
      .expect('Content-Type', 'text/plain; charset=utf-8')
      .expect(res => {
        const returnedData = res.body
        expect(returnedData).to.deep.equal({})
      })
  })

  it('POST /officers > should add an officer', async function () {
    const officerToBeAddedInfo = sampleOfficers[2]

    await request(server)
      .post('/officers')
      .send(officerToBeAddedInfo)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => {
        const returnedData = res.body
        expect(returnedData.id).to.be.above(0)
      })
  })

  it('PUT /officers/:id > should update info for officer with given id', async function () {
    const seedOfficer = sampleOfficers[0]
    const seedOfficer2 = sampleOfficers[1]
    const seedOfficer3 = sampleOfficers[2]

    await addOfficer(seedOfficer)
    await addOfficer(seedOfficer2)
    await addOfficer(seedOfficer3)

    const idOfOfficerToBeEdited = (await findAll()).rows[1].id

    await request(server)
      .put('/officers/' + idOfOfficerToBeEdited)
      .send(R.mergeRight(seedOfficer2, { name: 'sample name' }))
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => {
        const returnedData = res.body
        expect(returnedData).to.deep.equal({})
      })

    const editedOfficerData = await findOfficer(idOfOfficerToBeEdited)
    expect(editedOfficerData.rows[0].name).to.equal('sample name')
  })

  it('GET /officers/:id > should return correct info for officer with given id', async function () {
    const seedOfficer = sampleOfficers[0]
    const seedOfficer2 = sampleOfficers[1]
    const seedOfficer3 = sampleOfficers[2]

    await addOfficer(seedOfficer)
    await addOfficer(seedOfficer2)
    await addOfficer(seedOfficer3)

    const officerToBeQueried = (await findAll()).rows[1]

    await request(server)
      .get('/officers/' + officerToBeQueried.id)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => {
        const returnedData = res.body
        expect(returnedData).to.deep.equal(officerToBeQueried)
      })
  })

  after(async function () {
    await clearOfficersTable()
  })
})
