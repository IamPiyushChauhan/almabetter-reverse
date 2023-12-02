const trip = require('../model/trip')

class TripServices {
    static async saveTrip(tripData){
        let isSaved = false
        await trip.insertOne(tripData)
            .then(
                res => isSaved=true,
                err => console.error(`Something went wrong: ${err}`), 
            )
       return isSaved
    }
    static async tripsPagination(pageNo){
        try {
            console.log("Trips Pagination pageNo "+pageNo)
            const trips = await trip.find({}).limit(50).skip(50*pageNo).toArray();
            return trips
        }catch (err){
            console.log(err)
        }
    }
}

module.exports = TripServices