const stateDistrict = require('../model/stateDistrict')

class cityService {
    static async findCity(cityName){
        const pipeline = [
            { $match: { districts: {$regex:`.*${cityName}`,$options:"i"} } },
            { $set: { districts: { $filter: { input: "$districts",as: "district", cond: { $regexMatch: {input: "$$district",regex: `.*${cityName}`,options: "i"}}}}}},
            {$project: {_id: 0}}
        ]; 
        let city = []
        try{
            // Execute the aggregation
            const aggCursor =  stateDistrict.aggregate(pipeline);
            /*
            Aggregate MongoDB results to transform into a JSON array with city-state structure.
            Input: [{state: __, districts: [__,__]}, ...]
            Output: [{city: __, state:__}, ...]
            */
            let cityStateArr = []  
            for await(const doc of aggCursor) {
                let districts = doc.districts
                let state = doc.state
                for (let district in districts) {
                    cityStateArr.push({city: districts[district],state: state} )
                }
            }
            console.log(cityStateArr)
            return cityStateArr
        }catch(err){
            console.log(err)
        }

        
    }
}

module.exports = cityService