const Officers = require('./business')()

async function getAll (req, res) {
  const officers = await Officers.getAll()
  res.status(200).json(officers)
}
async function remove (req, res) {
  const id = req.params.id
  await Officers.remove(id)
  res.sendStatus(200)
}

module.exports = {
  getAll,
  remove
}
