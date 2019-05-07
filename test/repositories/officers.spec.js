const expect = require('chai').expect
const officersRepository = require('../../src/officer/repository')()
const db = require('../../db/pg')
const R = require('ramda')

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

const omitId = R.map(R.omit(['id']))

describe('officers repository', function () {
  beforeEach(async function () {
    await clearOfficersTable()
  })

  it('should be able to insert into db', async function () {
    const insertResult =
      await officersRepository.add({ name: 'some name' })
    expect(insertResult).to.be.above(0)

    const officers = await findAll()

    expect(omitId(officers.rows)).to.deep.equal([{
      name: 'some name',
      current_case_id: null
    }])
  })
  it('should be able to read data from db', async function () {
    await addOfficer({ name: 'some name' })
    await addOfficer({ name: 'officer name' })

    const readOfficers = await officersRepository.getAll()
    expect(omitId(readOfficers)).to.deep.equal([{
      name: 'some name',
      current_case_id: null
    }, {
      name: 'officer name',
      current_case_id: null
    }])
  })
  it('should be able to find by id', async function () {
    await addOfficer({ name: 'officer name' })
    const id = (await findAll()).rows[0].id

    const foundOfficer = await officersRepository.get(id)
    expect(
      R.omit(['id'])(foundOfficer))
      .to.deep.equal({
        name: 'officer name',
        current_case_id: null
      })

    const queryResult = await officersRepository.get(id + 10)
    expect(queryResult).to.be.an('undefined')
  })
  it('should be able to alter data', async function () {
    await addOfficer({ name: 'officer name' })
    const id = (await findAll()).rows[0].id

    const updateRestul = await officersRepository.update(id, {
      name: 'new officer name'
    })
    expect(updateRestul).to.be.equal(1)

    const changedOfficer = (await findOfficer(id)).rows[0]

    expect(
      R.omit(['id'])(changedOfficer))
      .to.deep.equal({
        name: 'new officer name',
        current_case_id: null
      })
  })
  it('should be able to remove data', async function () {
    await addOfficer({ name: 'officer name' })
    await addOfficer({ name: 'another officer' })

    const id = (await findAll()).rows[0].id

    const updateResult = await officersRepository.remove(id)
    expect(updateResult).to.be.equal(1)

    const officers = (await findAll()).rows
    expect(officers.length).to.equal(1)
    expect(
      R.omit(['id'])(officers[0]))
      .to.deep.equal({
        name: 'another officer',
        current_case_id: null
      })
  })

  after(async function () {
    await clearOfficersTable()
  })
})
