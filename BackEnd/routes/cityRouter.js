const express = require('express');
const controller = require('../controller/cityController')
const middleware = require('../middleware/cityMiddleware')
const router = express.Router();

router.get('/',middleware.isCityNameNotNull,controller.getFindCity)

module.exports = router