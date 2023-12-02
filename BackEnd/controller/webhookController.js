require("dotenv").config()
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)
const passagerTicketInfoService = require('../services/passagerTicketInfoService')
const busService = require('../services/busService')
class WebhookController {
  static async postCall(request, response) {
    const sig = request.headers['stripe-signature'];
    let endpointSecret;
    let event;
    let data;
    let eventType;

    if (endpointSecret) {

      try {
        console.log("---------------TRY-------------")
        event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
        console.log("------------------event-----------------")
        console.log(event)
        console.log("------------------event-----------------")
      } catch (err) {
        console.log("err in ")
        console.log(err)
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }

      data = request.body.data.object
      eventType = request.body.type

    } else {
      data = request.body.data.object
      eventType = request.body.type
      console.log("------------data----------------")
      console.log(data)
      console.log("-------------------------------")
      console.log("------------eventType-------------------")
      console.log(eventType)
      console.log("-------------------------------")

      if (eventType === "payment_intent.succeeded" || eventType === "checkout.session.completed") {
        console.log("---if called")
        stripe.customers.retrieve(data.customer)
          .then(async (result) => {
            console.log("-----customers Result------------")
            console.log(result)
            console.log("---------result.metadata----------")
            console.log(result.metadata)
            const id_data = result.metadata.data
            console.log("result.metadata.data \n" + result.metadata.data)
            let jsonObject = JSON.parse(id_data)
            let id = jsonObject.id
            let updateToDone = await passagerTicketInfoService.updatePaymentDone(id)
            console.log(updateToDone)
            let parr = await passagerTicketInfoService.findTicket(id)
            console.log("-------------passagerTicketInfoService.findTicket(id)---------------")
            console.log(parr)

            const busAndSeats = parr[0]?.bus_and_seats
            const bus_id = busAndSeats?._id
            const searArr = busAndSeats?.seleted_seats

            let seatNos = []
            let tripSeats = []
            for (let i = 0; i < searArr.length; i++) {
              let obj = searArr[i]
              console.log(obj)
              seatNos.push(obj.no)
              tripSeats.push(`${obj.no}${obj.type}`)
            }
            console.log(seatNos)
            console.log(bus_id)
            console.log(tripSeats)

            await busService.updateSeats(bus_id, seatNos)

            console.log("-------------passagerTicketInfoService---------------")
            console.log("-------------------")
            //console.log("data:" ,data)
          }).catch((err) => {
            console.log(err)
          });
      } else {
        console.log("else Called")
        console.log("Have to unseseved")
      }
    }
  }
}

module.exports = WebhookController