const router = require('express').Router()
const controller = require('../../src/officer/controller')

router.get('/officers', controller.getAll)

module.exports = router
