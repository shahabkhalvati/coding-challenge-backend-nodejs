const Officers = require('./business')()
const OfficerModel = require('./model')
const Future = require('fluture')
const S = require('sanctuary')

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
  const success = (id) => res.status(200).json({ id })

  const createOfficer = model =>
    Future.tryP(() => Officers.add(model))
      .fork(badRequest, success)

  S.either(badRequest)(createOfficer)(OfficerModel.from(req.body))
}

module.exports = {
  getAll,
  remove,
  add
}
