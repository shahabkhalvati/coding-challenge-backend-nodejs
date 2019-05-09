const sinon = require('sinon')
const expect = require('chai').expect
const reportAssigner = require('../../src/ReportAssigner')

describe('ReportAssigner', function () {
  it('should assign an unassigned case to an available officer', async function () {
    const mockedDb = {
      query: function () {}
    }

    const stub = sinon.stub(mockedDb, 'query')
    stub.onFirstCall().resolves({ rows: [{ id: 123 }] }) // officerId
    stub.onSecondCall().resolves({ rows: [{ id: 456 }] }) // reportId
    stub.resolves(1)

    const assigner = reportAssigner({
      inTransaction: async function (callback) {
        return callback(mockedDb)
      }
    })

    const assignResult = await assigner.assignReport()

    expect(assignResult).to.equal(1)
    expect(sinon.assert.callCount(stub, 4))
    sinon.restore()
  })
  it('should do nothing if there are no available officers', async function () {
    const mockedDb = {
      query: function () {}
    }

    const stub = sinon.stub(mockedDb, 'query')
    stub.onSecondCall().resolves({ rows: [] })
    stub.onFirstCall().resolves({ rows: [{ id: 123 }] })
    stub.resolves(1)

    const assigner = reportAssigner({
      inTransaction: async function (callback) {
        return callback(mockedDb)
      }
    })

    const assignResult = await assigner.assignReport()

    expect(assignResult).to.equal(0)
    expect(sinon.assert.callCount(stub, 2))
    sinon.restore()
  })
  it('should do nothing when there are no unresolved cases', async function () {
    const mockedDb = {
      query: function () {}
    }

    const stub = sinon.stub(mockedDb, 'query')
    stub.onFirstCall().resolves({ rows: [{ id: 123 }] })
    stub.onSecondCall().resolves({ rows: [] })
    stub.resolves(1)

    const assigner = reportAssigner({
      inTransaction: async function (callback) {
        return callback(mockedDb)
      }
    })

    const assignResult = await assigner.assignReport()

    expect(assignResult).to.equal(0)
    expect(sinon.assert.callCount(stub, 2))
    sinon.restore()
  })
})
