const R = require('ramda')
const S = require('sanctuary')
const common = require('../../bin/common')

const isValid = R.where({
  name: common.isNonEmptyString
})

module.exports = {
  isValid,
  from: (data) => {
    const builtModel = R.compose(
      R.mergeDeepRight({ name: null }),
      R.pick(['name']),
      R.ifElse(common.isNil, R.always({}), R.identity)
    )(data)

    return isValid(builtModel)
      ? S.Right(builtModel)
      : S.Left('Could not build model from provided data')
  }
}
