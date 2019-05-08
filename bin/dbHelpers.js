const R = require('ramda')
const common = require('./common')

const strictEqualityComparer = (key, index) => `${key} = $${index + 1}`
const looseEqualityComparer = (key, index) => `${key} LIKE $${index + 1}`

const whereClauseFromModel =
  (conditionJoiner) =>
    (withStrictComparison = true) => {
      const comparer = withStrictComparison
        ? strictEqualityComparer
        : looseEqualityComparer

      return R.ifElse(
        common.isNilOrEmpty,
        R.always(''),
        R.compose(
          (clause) => `WHERE ${clause}`,
          R.join(conditionJoiner),
          (model) => R.keys(model).map(comparer)
        )
      )
    }

const orClauseFromModel =
  (withStrictComparison) =>
    whereClauseFromModel(' OR ')(withStrictComparison)

const andClauseFromModel =
  (withStrictComparison) =>
    whereClauseFromModel(' AND ')(withStrictComparison)

const clauseParamsFromModel =
  (withStrictComparison = true) =>
    withStrictComparison
      ? R.values
      : R.compose(
        R.map(
          R.ifElse(
            common.isNonEmptyString,
            (value) => `%${value}%`,
            R.identity
          )),
        R.values
      )

module.exports = {
  orClauseFromModel,
  andClauseFromModel,
  clauseParamsFromModel
}
