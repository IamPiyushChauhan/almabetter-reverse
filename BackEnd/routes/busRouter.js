const express = require('express');
const controller = require('../controller/busController')
const middleware = require('../middleware/busMiddleware')
const router = express.Router();

router.get('/',middleware.isValidData,controller.getBuses)
router.get('/find-by-id',controller.getBusById)
router.post('/payment',controller.postPaymentCall)

module.exports = router