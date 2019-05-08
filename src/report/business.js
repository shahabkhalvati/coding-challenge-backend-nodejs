const get = (reportRepository) =>
  async (id) => reportRepository.get(id)

const getAll = (reportRepository) =>
  async () => reportRepository.getAll()

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
