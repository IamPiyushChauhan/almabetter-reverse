const express = require('express');
const router = express.Router();
const controller  = require("../controller/passagerTicketInfoController")

router.get("/",controller.getCall)

module.exports = router