const R = require('ramda')
const common = require('../../bin/common')
const reportAssigner = require('../ReportAssigner')()
const Officers = require('../officer/business')()

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
  async (model) => {
    const result = await reportRepository.add(model)
    await reportAssigner.assignReport()
    return result
  }

const update = (reportRepository) =>
  async (id, model) => {
    const result = await reportRepository.update(id, model)
    if (model.is_resolved) {
      const currentReport = (await get(reportRepository)(id))
      const officerId =
        currentReport.associate_officer && currentReport.associate_officer.id

      const officersCurrentCaseId = officerId && (
        await Officers.get(officerId))
        .current_case_id

      if (Number(officersCurrentCaseId) === Number(id)) {
        await Officers.update(officerId, { current_case_id: null })
        await reportAssigner.assignReport()
      }
    }

    return result
  }

module.exports = function (reportRepository = require('./repository')()) {
  return {
    get: get(reportRepository),
    getAll: getAll(reportRepository),
    remove: remove(reportRepository),
    add: add(reportRepository),
    update: update(reportRepository)
  }
}
