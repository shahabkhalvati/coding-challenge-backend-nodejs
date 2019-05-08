const R = require('ramda')
const S = require('sanctuary')
const common = require('../../bin/common')

const schema = {
  name: common.isNonEmptyString,
  current_case_id: common.isOptionalNumber,
  id: common.isOptionalNumber
}

const keys = R.keys(schema)

const isValid = R.where(schema)

module.exports = {
  isValid,
  from: (data) => {
    const builtModel = R.compose(
      R.mergeDeepRight({ name: null }),
      R.pick(keys),
      R.ifElse(common.isNil, R.always({}), R.identity)
    )(data)

    return isValid(builtModel)
      ? S.Right(builtModel)
      : S.Left('Could not build model from provided data')
  }
}
