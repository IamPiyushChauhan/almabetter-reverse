const passagerTicketInfo  = require("../model/passagerTicketInfo") 




class PassagerTicketInfoService{
    static async findTicketWithoutPandingPayment(id){
        try{
            console.log("find ticket"+ id)
            const data = await passagerTicketInfo.find({ticket_id: id, payment: "done"}).toArray()
            return data
        }catch(e){
            console.log(e)
        }
    }
    static async findTicket(id){
        try{
            console.log("find ticket"+ id)
            const data = await passagerTicketInfo.find({ticket_id: id}).toArray()
            return data
        }catch(e){
            console.log(e)
        }
    }

    static async  updatePaymentDone(id) {
        try {
          const filter = { ticket_id: id };
          const options = { upsert: true };
          const updateDoc = { "$set": { "payment": "done"}, };
          const result = await passagerTicketInfo.updateOne(filter, updateDoc, options);
          console.log(
            `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
          );
          return result.modifiedCount
        } catch (err) {
          console.log(err)
        }
      }


    static async saveTicket(data){
        console.log("saveTicket called")
        try{
            let isSaved = false
        await passagerTicketInfo.insertOne({...data,payment: "Panding"})
            .then(
                res => isSaved=true,
                err => console.error(`Something went wrong: ${err}`), 
            )
       console.log(isSaved)
       return isSaved
        }catch(e){
            console.log(e)
        }
    }
}

module.exports = PassagerTicketInfoService