const getAll = (officerRepository) =>
  async () => officerRepository.getAll()

module.exports = function (officerRepository = require('./repository')()) {
  return {
    getAll: getAll(officerRepository)
  }
}
