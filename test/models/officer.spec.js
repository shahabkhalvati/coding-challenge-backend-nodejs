const S = require('sanctuary')
const expect = require('chai').expect
const officerModel = require('../../src/officer/model')

describe('models.officer', () => {
  describe('.isValid', () => {
    it('happy path', () => {
      expect(officerModel.isValid({ name: 'something' })).to.equal(true)
    })
    it('should not validate when name is empty', function () {
      expect(officerModel.isValid({ name: '' })).to.equal(false)
    })
    it('should not validate when name is not present in object', function () {
      expect(officerModel.isValid({})).to.equal(false)
      expect(officerModel.isValid({ notName: 'sample' })).to.equal(false)
    })
    it('should not validate when name is Null of Empty', function () {
      expect(officerModel.isValid({ name: null })).to.equal(false)
      expect(officerModel.isValid({ name: (void 0) })).to.equal(false)
    })
    it('should not validate when name is not string', function () {
      expect(officerModel.isValid({ name: 1 })).to.equal(false)
      expect(officerModel.isValid({ name: {} })).to.equal(false)
      expect(officerModel.isValid({ name: function () { } })).to.equal(false)
    })
  })
  describe('.from', function () {
    const fail = expect.fail

    it('happy path', function () {
      const builtModel = officerModel.from({ name: 'string' })
      const unboxedValue = S.either(fail)(S.I)(builtModel)
      expect(unboxedValue).to.deep.equal({ name: 'string' })
    })
    it('should fail if field has incorrect type', function () {
      expect(S.isLeft(officerModel.from({ name: 123 }))).to.equal(true)
      expect(S.isLeft(officerModel.from({ name: () => { } }))).to.equal(true)
    })
    it('should return left if required props are not available', function () {
      expect(S.isLeft(officerModel.from({}))).to.equal(true)
      expect(S.isLeft(officerModel.from({ family: 'string' }))).to.equal(true)
    })
    it('should return left when null or undefined are passed', function () {
      expect(S.isLeft(officerModel.from((void 0)))).to.equal(true)
      expect(S.isLeft(officerModel.from(null))).to.equal(true)
    })
    it('should omit redundant props', function () {
      const builtModel =
        officerModel.from({ name: 'string', prop: 'something' })
      const unboxedValue = S.either(fail)(S.I)(builtModel)
      expect(unboxedValue).to.deep.equal({ name: 'string' })
    })
  })
})
