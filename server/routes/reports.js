const router = require('express').Router()
const controller = require('../../src/report/controller')

router.get('/reports/:id', controller.get)
router.get('/reports', controller.getAll)
router.delete('/reports/:id', controller.remove)
router.post('/reports', controller.add)
router.put('/reports/:id', controller.update)

module.exports = router
