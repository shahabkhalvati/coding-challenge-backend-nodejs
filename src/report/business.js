const getAll = (reportRepository) =>
  async () => reportRepository.getAll()

module.exports = function (reportRepository = require('./repository')()) {
  return {
    getAll: getAll(reportRepository)
  }
}
