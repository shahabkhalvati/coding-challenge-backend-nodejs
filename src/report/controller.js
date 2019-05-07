const Reports = require('./business')()

async function getAll (req, res) {
  const reports = await Reports.getAll()
  res.status(200).json(reports)
}

module.exports = {
  getAll
}
