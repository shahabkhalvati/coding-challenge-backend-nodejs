const sinon = require('sinon')
const expect = require('chai').expect
// const common = require('../../bin/common')

describe('Officers business layer', function () {
  let officersRepository = {}
  const officers = require('../../src/officer/business')(officersRepository)

  afterEach(function () {
    officersRepository = {}
  })

  it('should be able to return all officers', async function () {
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
})
