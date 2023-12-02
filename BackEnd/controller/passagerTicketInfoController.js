const service = require('../services/passagerTicketInfoService')

class passagerTicketInfoController {
    static async getCall(req,res){
        try{
            let data = req.query
            let ticketId = data.ticket_id
            console.log(ticketId)
            let result = await service.findTicketWithoutPandingPayment(ticketId)
            console.log(result)
            res.status(200).json(result)
        }catch (e){
            console.log(e)
            res.status(500).json({err: e})
        }
        

    }
}

module.exports = passagerTicketInfoController