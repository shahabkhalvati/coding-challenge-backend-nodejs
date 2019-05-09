const R = require('ramda')
const common = require('../bin/common')

const findAvailableOfficer = (db) => db.query(
  `SELECT id FROM officers
  WHERE current_case_id IS NULL LIMIT 1 FOR UPDATE`)

const findUnresolvedReport = (db) => db.query(
  `SELECT id FROM reports
    WHERE associate_officer_id IS NULL LIMIT 1 FOR UPDATE`)

const assignReport =
  (db) =>
    async () =>
      db.inTransaction(async function (transaction) {
        const [availableOfficerIds, availableReportIds] =
          await Promise.all([
            findAvailableOfficer(transaction),
            findUnresolvedReport(transaction)])

        // common.focusedInspect('officers')(availableOfficerIds)
        // common.focusedInspect('reports')(availableReportIds)

        if (common.isNilOrEmpty(availableOfficerIds.rows) ||
          common.isNilOrEmpty(availableReportIds.rows)) {
          return 0
        }

        const availableOfficerId = availableOfficerIds.rows[0].id
        const availableReportId = availableReportIds.rows[0].id
        const reportRepository = require('./report/repository')(transaction)
        const officerRepository = require('./officer/repository')(transaction)

        const finalResult = await Promise.all([
          reportRepository.update(
            availableReportId, { 'associate_officer_id': availableOfficerId }),
          officerRepository.update(
            availableOfficerId, { 'current_case_id': availableReportId })
        ]).then(R.always(1))

        return finalResult
      })

module.exports =
  function (db = require('../db/pg')) {
    return {
      assignReport: assignReport(db)
    }
  }
