const R = require('ramda')
const S = require('sanctuary')
const common = require('../../bin/common')

const schema = {
  ID: common.isOptionalNumber,
  description: common.isOptionalString,
  license_number: common.isOptionalString,
  color: common.isOptionalString,
  type: common.isOptionalString,
  owner_full_name: common.isOptionalString,
  is_resolved: common.isOptionalBoolean,
  associate_officer_id: common.isOptionalNumber
}

const keys = R.keys(schema)

const isValid = R.where(schema)

module.exports = {
  isValid,
  from: (data) => {
    const builtModel = R.compose(
      R.mergeDeepRight({}),
      R.pick(keys),
      R.ifElse(common.isNil, R.always({}), R.identity)
    )(data)

    return isValid(builtModel)
      ? S.Right(builtModel)
      : S.Left('Could not build model from provided data')
  }
}
