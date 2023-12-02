const express = require('express');
const router = express.Router();
const controller = require('../controller/webhookController')

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)

router.post('/',controller.postCall)

module.exports= router