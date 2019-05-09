const Reports = require('./business')()
const Officers = require('../officer/business')()
const ReportModel = require('./model')
const Future = require('fluture')
const S = require('sanctuary')

async function get (req, res) {
  const failed = () => res.sendStatus(500)
  const success = (data) => res.status(200).json(data)

  Future.tryP(() => Reports.get(req.params.id))
    .fork(failed, success)
}

async function getAll (req, res) {
  const reports = await Reports.getAll(req.query)
  res.status(200).json(reports)
}
async function remove (req, res) {
  const id = req.params.id
  await Reports.remove(id)
  res.sendStatus(200)
}
async function add (req, res) {
  const badRequest = () => res.sendStatus(400)
  const success = (data) => res.status(200).json(data)

  const createReport = model =>
    Future.tryP(() => Reports.add(model))
      .map(id => ({ id }))
      .fork(badRequest, success)

  S.either(badRequest)(createReport)(ReportModel.from(req.body))
}
async function update (req, res) {
  const badRequest = () => res.sendStatus(400)
  const success = () => res.status(200).json({})

  const updateReport = model =>
    Future.tryP(() => Reports.update(req.params.id, model))
      .fork(badRequest, success)

  S.either(badRequest)(updateReport)(ReportModel.from(req.body))
}
async function resolve (req, res) {
  const reportId = req.params.id

  if (!(reportId)) {
    res.sendStatus(400)
    return
  }

  const failed = () => res.sendStatus(500)
  const success = () => res.sendStatus(200)

  Future.tryP(
    async () =>
      Reports.update(reportId, { is_resolved: true }))
    .fork(failed, success)
}

module.exports = {
  get,
  getAll,
  remove,
  add,
  update,
  resolve
}
