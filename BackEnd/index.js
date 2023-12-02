const express = require('express');
const app = express();
require("dotenv").config()
const bodyParser = require('body-parser');
const PORT = process.env.PORT;
const tripsRouter = require('./routes/tripsRoutes')
const cityRouter = require('./routes/cityRouter')
const busRouter = require('./routes/busRouter')
const webhookRouter = require('./routes/webhookRoutes')
const passagerTicketInfoRouter = require('./routes/passagerTicketInfoRouter')
app.use(bodyParser.json());


app.use('/trips',tripsRouter);
app.use('/city',cityRouter);
app.use('/bus',busRouter)
app.use('/webhook', webhookRouter)
app.use('/passanger-ticket-info',passagerTicketInfoRouter)




app.listen(PORT, function (err) {
	if (err) console.log(err);
	console.log("Server listening on PORT", PORT);
});