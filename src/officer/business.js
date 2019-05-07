const getAll = (officerRepository) =>
  async () => officerRepository.getAll()

const remove = (officerRepository) =>
  async (id) => officerRepository.remove(id)

module.exports = function (officerRepository = require('./repository')()) {
  return {
    getAll: getAll(officerRepository),
    remove: remove(officerRepository)
  }
}
