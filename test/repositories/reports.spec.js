const expect = require('chai').expect
const reportsRepository = require('../../src/report/repository')()
const db = require('../../db/pg')
const R = require('ramda')

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
function findReport (id) {
  return db.query('SELECT * FROM reports WHERE id = $1', [id])
}

const omitAutoFields =
  R.omit([
    'id', 'associate_officer_id', 'date_of_submit', 'date_of_theft', 'officer_name'
  ])

describe('reports repository', function () {
  beforeEach(async function () {
    await clearReportsTable()
  })

  it('should be able to insert into db', async function () {
    const insertResult =
      await reportsRepository.add({
        'description': 'description placeholder',
        'license_number': 'license number',
        'color': 'some color',
        'type': 'some type',
        'owner_full_name': 'full name of owner'
      })
    expect(insertResult).to.equal(1)

    const reports = await findAll()

    expect(
      R.map(omitAutoFields)(reports.rows)
    ).to.deep.equal([{
      'description': 'description placeholder',
      'license_number': 'license number',
      'color': 'some color',
      'type': 'some type',
      'owner_full_name': 'full name of owner',
      'is_resolved': false
    }])
  })
  it('should be able to read data from db', async function () {
    await addReport({
      'description': 'description placeholder',
      'license_number': 'license number',
      'color': 'some color',
      'type': 'some type',
      'owner_full_name': 'full name of owner'
    })
    await addReport({
      'description': 'another description',
      'license_number': 'another license number',
      'color': 'another color',
      'type': 'another type',
      'owner_full_name': 'another full name'
    })

    const readReports = await reportsRepository.getAll()
    expect(
      R.map(omitAutoFields, readReports)).to.deep.equal([{
      'description': 'description placeholder',
      'license_number': 'license number',
      'color': 'some color',
      'type': 'some type',
      'owner_full_name': 'full name of owner',
      'is_resolved': false
    }, {
      'description': 'another description',
      'license_number': 'another license number',
      'color': 'another color',
      'type': 'another type',
      'owner_full_name': 'another full name',
      'is_resolved': false
    }])
  })
  it('should be able to find by id', async function () {
    await addReport({
      'description': 'description placeholder',
      'license_number': 'license number',
      'color': 'some color',
      'type': 'some type',
      'owner_full_name': 'full name of owner'
    })
    const id = (await findAll()).rows[0].id

    const fountReports = await reportsRepository.get(id)
    expect(omitAutoFields(fountReports))
      .to.deep.equal({
        'description': 'description placeholder',
        'license_number': 'license number',
        'color': 'some color',
        'type': 'some type',
        'owner_full_name': 'full name of owner',
        'is_resolved': false
      })

    const queryResult = await reportsRepository.get(id + 10)
    expect(queryResult).to.be.an('undefined')
  })
  it('should be able to alter data', async function () {
    await addReport({
      'description': 'description placeholder',
      'license_number': 'license number',
      'color': 'some color',
      'type': 'some type',
      'owner_full_name': 'full name of owner'
    })
    const id = (await findAll()).rows[0].id

    const updateResult = await reportsRepository.update(id, {
      color: 'new color',
      type: 'new type'
    })
    expect(updateResult).to.be.equal(1)

    const changedOfficer = (await findReport(id)).rows[0]

    expect(omitAutoFields(changedOfficer))
      .to.deep.equal({
        'description': 'description placeholder',
        'license_number': 'license number',
        'color': 'new color',
        'type': 'new type',
        'owner_full_name': 'full name of owner',
        'is_resolved': false
      })
  })
  it('should be able to remove data', async function () {
    await addReport({
      'description': 'description placeholder',
      'license_number': 'license number',
      'color': 'some color',
      'type': 'some type',
      'owner_full_name': 'full name of owner'
    })
    await addReport({
      'description': 'another description',
      'license_number': 'another license number',
      'color': 'another color',
      'type': 'another type',
      'owner_full_name': 'another full name'
    })

    const id = (await findAll()).rows[0].id

    const queryResult = await reportsRepository.remove(id)
    expect(queryResult).to.be.equal(1)

    const reports = (await findAll()).rows
    expect(reports.length).to.equal(1)
    expect(
      omitAutoFields(reports[0]))
      .to.deep.equal({
        'description': 'another description',
        'license_number': 'another license number',
        'color': 'another color',
        'type': 'another type',
        'owner_full_name': 'another full name',
        'is_resolved': false
      })
  })

  after(async function () {
    await clearReportsTable()
  })
})
