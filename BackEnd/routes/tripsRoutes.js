const express = require('express');
const tripsController = require('../controller/tripsController')
const tripsRouter = express.Router();

tripsRouter.post('/',tripsController.postTrips)
tripsRouter.get('/:page_no?',  tripsController.getPaginationTrips)
tripsRouter.get('/',  tripsController.getPaginationTrips)
module.exports = tripsRouter