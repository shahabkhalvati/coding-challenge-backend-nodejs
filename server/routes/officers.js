const router = require('express').Router()
const controller = require('../../src/officer/controller')

router.get('/officers', controller.getAll)
router.delete('/officers/:id', controller.remove)

module.exports = router
