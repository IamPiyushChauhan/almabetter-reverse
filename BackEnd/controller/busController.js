require("dotenv").config()
const service = require('../services/busService')
const DataGeanatorService = require('../services/busCreateService')
const tripServices = require('../services/tripsServices')
const passagerTicketInfoService = require('../services/passagerTicketInfoService')
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)
class BusController {
    static async getBusById(req,res){
      let data = req.query
      let id = data.id
      console.log(id)
      try{
        let result = await service.findBusById(id)
      
        res.status(200).json(result)
      }catch(e){
        console.log(e)
        res.status(500).json({err: e})
      }

    }

    static async getBuses(req, res){
       let data = req.query
       console.log(data)

       try{
        let buses = await service.findBus(data)

        if(buses?.length ===0){
            console.log("GENERATING DATA")
            await DataGeanatorService(data.from,data.fromState,data.to,data.toState,data.date)
            buses = await service.findBus(data)
        }

       res.status(200).json(buses)
       }catch(e){
        console.log("Error in bus controller\n"+ e)
        res.status(500).json({error: e})
       }
       
    }

    static async postPaymentCall(req,res){
        const data = req.body
        console.log("----------------------------------------------")
        const busAndSeats = data?.bus_and_seats
        const id = busAndSeats?._id
        const searArr = busAndSeats?.seleted_seats
        console.log("ticket_id : "+data?.ticket_id)
        
        const customer = await stripe.customers.create({
            metadata: {
              data: JSON.stringify({id: data?.ticket_id})
            },
          });

        let seatNos = []
        let tripSeats = []
        for(let i=0;i<searArr.length;i++){
          let obj = searArr[i]
          console.log(obj)
          seatNos.push(obj.no)
          tripSeats.push(`${obj.no}${obj.type}`)
        }
        
        console.log(seatNos)
        console.log(id)
        console.log(tripSeats)
        let isSuccessPay = false
        
        try{
            const priceResult = await service.saveAndPrintBill(id,seatNos)
            await passagerTicketInfoService.saveTicket(data)
            const price_list=  priceResult[0]
            const price = priceResult[1]
            
            //await tripServices.saveTrip(service.getTrip(id,price,tripSeats))
            console.log("log Befour the session")
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                mode: "payment",
                line_items: price_list,
                customer: customer.id,
                success_url: `${process.env.CLIENT_URL}/success`,
                cancel_url: `${process.env.CLIENT_URL}/cancel`,
              })
            console.log(session.url )
              res.status(200).json({ url: session.url })
              
        }catch(e){
            console.log("Error in bus controller\n"+ e)
            res.status(500).json({error: e})
        }
    }

   

   
}

module.exports = BusController