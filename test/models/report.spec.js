const S = require('sanctuary')
const expect = require('chai').expect
const reportModel = require('../../models/report')

describe('models.officer', () => {
  describe('.isValid', () => {
    it('happy path', () => {
      expect(reportModel.isValid({
        description: 'string',
        license_number: 'string',
        color: 'string',
        type: 'string',
        owner_full_name: 'string'
      })).to.equal(true)
      expect(reportModel.isValid({
        description: null,
        license_number: null,
        color: null,
        type: null,
        owner_full_name: null
      })).to.equal(true)
      expect(reportModel.isValid({
        description: '',
        license_number: '',
        color: '',
        type: '',
        owner_full_name: ''
      })).to.equal(true)
      expect(reportModel.isValid({})).to.equal(true)
      expect(reportModel.isValid({
        description: 'string',
        type: '',
        owner_full_name: null
      })).to.equal(true)
    })
    it('should not validate when property type is provided but mismatched', () => {
      expect(reportModel.isValid({ description: 1 })).to.equal(false)
      expect(reportModel.isValid({ license_number: 1 })).to.equal(false)
      expect(reportModel.isValid({ color: 1 })).to.equal(false)
      expect(reportModel.isValid({ type: 1 })).to.equal(false)
      expect(reportModel.isValid({ owner_full_name: 1 })).to.equal(false)

      expect(reportModel.isValid({ license_number: () => { } })).to.equal(false)
      expect(reportModel.isValid({ color: {} })).to.equal(false)
    })
  })
  describe('.from', () => {
    const fail = expect.fail

    it('happy path', () => {
      const builtModel = reportModel.from({
        ID: 123,
        description: 'string',
        license_number: 'string',
        color: 'string',
        type: 'string',
        owner_full_name: 'string',
        is_resolved: false,
        associate_officer_id: 123
      })
      const unboxedValue = S.either(fail)(S.I)(builtModel)
      expect(unboxedValue).to.deep.equal({
        ID: 123,
        description: 'string',
        license_number: 'string',
        color: 'string',
        type: 'string',
        owner_full_name: 'string',
        is_resolved: false,
        associate_officer_id: 123
      })
    })
    it('should fail if a provided field has incorrect type', () => {
      expect(S.isLeft(reportModel.from({ ID: '123' }))).to.equal(true)
      expect(S.isLeft(reportModel.from({ description: 123 }))).to.equal(true)
      expect(S.isLeft(reportModel.from({
        ID: '123',
        color: 'string'
      }))).to.equal(true)
    })
    it('should handle empty object', () => {
      const builtModel = reportModel.from({})
      const unboxedValue = S.either(fail)(S.I)(builtModel)
      expect(unboxedValue).to.deep.equal({})
    })
    it('should handle null', () => {
      const builtModel = reportModel.from()
      const unboxedValue = S.either(fail)(S.I)(builtModel)
      expect(unboxedValue).to.deep.equal({})
    })
    it('should handle undefined', () => {
      const builtModel = reportModel.from((void 0))
      const unboxedValue = S.either(fail)(S.I)(builtModel)
      expect(unboxedValue).to.deep.equal({})
    })
    it('should omit redundant props', () => {
      const builtModel = reportModel.from({
        name: 'string',
        redundant_field: 2,
        description: 'string',
        license_number: 'string',
        color: 'string',
        type: 'string',
        owner_full_name: 'string'
      })
      const unboxedValue = S.either(fail)(S.I)(builtModel)
      expect(unboxedValue).to.deep.equal({
        description: 'string',
        license_number: 'string',
        color: 'string',
        type: 'string',
        owner_full_name: 'string'
      })
    })
  })
})
