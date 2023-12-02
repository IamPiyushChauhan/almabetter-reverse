const service = require('../services/tripsServices') 

class TripsController {
    
    static async postTrips(req,res) {
        console.log("Tips rout post call /")
        const tripData = req.body
        try{
            const savedTrip = await  service.saveTrip(tripData)
            if(savedTrip){
                res.status(201).json({success: "Trip added successfully"})
            }else {
                res.status(500).json({failed: "Trip added failed"})                
            }  
        }catch (err){
            console.log(err)
            res.status(500).json({error: err})
        }
    }

    static async getPaginationTrips(req, res){
        console.log("Tips rout get call /:page_no?")
        try {
	        let pageNo = (req.params.page_no === undefined) ? 0 :  Number(req.params.page_no)
	        const trips = await service.tripsPagination(pageNo)
	        res.status(200).json(trips)
        }catch (err){
            res.status(500).json({error: err})
        }
        
    }

    static async getFilterTripByDate(req,res){
        const date = req.query.date;
        res.json({w: userId})
    }

}

module.exports = TripsController