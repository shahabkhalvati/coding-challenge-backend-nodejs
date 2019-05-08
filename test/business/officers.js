const sinon = require('sinon')
const expect = require('chai').expect
const OfficersBusiness = require('../../src/officer/business')

describe('Officers business layer', function () {
  it('should be able to return all officers', async function () {
    let officersRepository = {}
    const officersList = [{
      id: 123,
      name: 'officer name',
      current_case_id: 456
    }, {
      id: 124,
      name: 'another officer name',
      current_case_id: 457
    }]
    officersRepository.getAll = sinon.stub().resolves(officersList)
    const officers = OfficersBusiness(officersRepository)

    const loadedOfficers = await officers.getAll()

    expect(loadedOfficers).to.deep.equal([{
      id: 123,
      name: 'officer name',
      current_case_id: 456
    }, {
      id: 124,
      name: 'another officer name',
      current_case_id: 457
    }])
  })

  it('should be able to filter officers by query model', async function () {
    let officersRepository = {}
    const queryModel = {
      name: 'officer name'
    }
    const foundOfficer = {
      id: 123,
      name: 'officer name',
      current_case_id: 456
    }
    officersRepository.getAll =
      sinon.stub().withArgs(queryModel).resolves([foundOfficer])

    const officers = OfficersBusiness(officersRepository)

    expect(await officers.getAll(queryModel)).to.deep.equal([foundOfficer])
  })

  it('should be able to return officer detail by id', async function () {
    let officersRepository = {}
    const officerData = {
      id: 123,
      name: 'officer name',
      current_case_id: 456
    }

    officersRepository.get = sinon.stub().withArgs(123).resolves(officerData)
    const officers = OfficersBusiness(officersRepository)

    expect(await officers.get(123)).to.deep.equal(officerData)
  })

  it('should be able to remove an officer by id', async function () {
    const fakeRemove = sinon.stub()
    fakeRemove.withArgs(123).resolves(1)
    fakeRemove.withArgs(456).resolves(0)

    let officersRepository = {
      remove: fakeRemove
    }
    const officers = OfficersBusiness(officersRepository)

    expect(await officers.remove(123)).to.equal(1)
    expect(await officers.remove(456)).to.equal(0)
  })

  it('should be able to add an officer', async function () {
    const officerData = { name: 'officer name' }
    const fakeAdd = sinon.stub().withArgs(officerData).resolves(123)

    let officersRepository = {
      add: fakeAdd
    }
    const officers = OfficersBusiness(officersRepository)

    expect(await officers.add(officerData)).to.equal(123)
  })

  it('should be able to update an officer by id', async function () {
    const officerData = { name: 'officer name' }
    const fakeUpdate = sinon.stub().withArgs(
      123, officerData
    ).resolves(1)

    let officersRepository = {
      update: fakeUpdate
    }
    const officers = OfficersBusiness(officersRepository)

    expect(await officers.update(123, officerData)).to.equal(1)
  })
})
