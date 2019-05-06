const R = require('ramda')

const prettyPrint = (obj) => JSON.stringify(obj, null, 2)
const inspect =
  (desc) =>
    (i) =>
      console.log(`${desc}:\n${prettyPrint(i)}`) || R.identity(i)

const print =
  (desc) =>
    (i) =>
      console.log(desc || '') || R.identity(i)

const FOCUS_CHARS = '----------------------------------------'
const focusedInspect =
  desc =>
    R.compose(
      print(), print(FOCUS_CHARS), inspect(desc), print(FOCUS_CHARS), print())

const isString = R.is(String)
const isEmptyString = R.both(isString, R.isEmpty)
const isNonEmptyString = R.both(isString, R.complement(R.isEmpty))
const isNumber = R.is(Number)
const isObject = R.is(Object)
const isBoolean = R.is(Boolean)
const isNil = R.isNil

const isOptional = (predicate) => R.anyPass([isNil, predicate])

module.exports = {
  prettyPrint,
  print,
  focusedInspect,
  inspect,
  isBoolean,
  isOptionalBoolean: isOptional(isBoolean),
  isString,
  isEmptyString,
  isNonEmptyString,
  isOptionalString: isOptional(isString),
  isOptionalNumber: isOptional(isNumber),
  isNumber,
  isObject,
  isNil
}
