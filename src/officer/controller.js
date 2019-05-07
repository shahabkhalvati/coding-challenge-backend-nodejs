const Officers = require('./business')()

async function getAll (req, res) {
  const officers = await Officers.getAll()
  res.status(200).json(officers)
}

module.exports = {
  getAll
}
