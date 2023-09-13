const express = require('express')
const router = express.router()
const controller = require('~/controllers/boardController')

router.get('/', controller.test)

module.exports = router
