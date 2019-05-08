const Officers = require('./business')()
const OfficerModel = require('./model')
const Future = require('fluture')
const S = require('sanctuary')

async function get (req, res) {
  const failed = () => res.sendStatus(500)
  const success = (data) => res.status(200).json(data)

  Future.tryP(() => Officers.get(req.params.id))
    .fork(failed, success)
}

async function getAll (req, res) {
  const officers = await Officers.getAll()
  res.status(200).json(officers)
}
async function remove (req, res) {
  const id = req.params.id
  await Officers.remove(id)
  res.sendStatus(200)
}
async function add (req, res) {
  const badRequest = () => res.sendStatus(400)
  const success = (data) => res.status(200).json(data)

  const createOfficer = model =>
    Future.tryP(() => Officers.add(model))
      .map(id => ({ id }))
      .fork(badRequest, success)

  S.either(badRequest)(createOfficer)(OfficerModel.from(req.body))
}
async function update (req, res) {
  const badRequest = () => res.sendStatus(400)
  const success = () => res.status(200).json({})

  const updateOfficer = model =>
    Future.tryP(() => Officers.update(req.params.id, model))
      .fork(badRequest, success)

  S.either(badRequest)(updateOfficer)(OfficerModel.from(req.body))
}

module.exports = {
  get,
  getAll,
  remove,
  add,
  update
}
