const R = require('ramda')
const common = require('../../bin/common')

const removeOfficerFields =
  R.omit(['associate_officer_id', 'officer_name'])

const groupOfficerFields =
  (report) => R.mergeRight(
    report,
    common.isNilOrEmpty(report.associate_officer_id)
      ? { associate_officer: null }
      : {
        associate_officer: {
          id: report.associate_officer_id,
          name: report.officer_name
        }
      })

const reshapeOfficerModel =
  R.compose(removeOfficerFields, groupOfficerFields)

const get = (reportRepository) =>
  async (id) => reportRepository.get(id)
    .then(reshapeOfficerModel)

const getAll = (reportRepository) =>
  async (model) => {
    return reportRepository
      .getAll(model)
      .then(R.map(reshapeOfficerModel))
  }

const remove = (reportRepository) =>
  async (id) => reportRepository.remove(id)

const add = (reportRepository) =>
  async (model) => reportRepository.add(model)

const update = (reportRepository) =>
  async (id, model) => reportRepository.update(id, model)

module.exports = function (reportRepository = require('./repository')()) {
  return {
    get: get(reportRepository),
    getAll: getAll(reportRepository),
    remove: remove(reportRepository),
    add: add(reportRepository),
    update: update(reportRepository)
  }
}
