const router = require('express').Router()
const controller = require('../../src/report/controller')

router.get('/reports', controller.getAll)

module.exports = router
