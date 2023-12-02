const service = require('../services/cityService')

class CityController {
    static async getFindCity(req,res){
        const cityName = req.query.city_name
        try{
            let cityInfo= await service.findCity(cityName)
            res.status(200).send(cityInfo)
        }catch (err){
            res.status(500).json(err)
        }
    }
}

module.exports = CityController