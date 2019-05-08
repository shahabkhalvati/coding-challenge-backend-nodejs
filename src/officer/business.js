const get = (officerRepository) =>
  async (id) => officerRepository.get(id)

const getAll = (officerRepository) =>
  async () => officerRepository.getAll()

const remove = (officerRepository) =>
  async (id) => officerRepository.remove(id)

const add = (officerRepository) =>
  async (model) => officerRepository.add(model)

const update = (officerRepository) =>
  async (id, model) => officerRepository.update(id, model)

module.exports = function (officerRepository = require('./repository')()) {
  return {
    get: get(officerRepository),
    getAll: getAll(officerRepository),
    remove: remove(officerRepository),
    add: add(officerRepository),
    update: update(officerRepository)
  }
}
