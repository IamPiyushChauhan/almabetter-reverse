

class cityMiddleware {
    static isCityNameNotNull(req,res,next){
        const cityName = req.query.city_name
        if(cityName==='' || cityName===undefined || cityName===null){
            res.status(400).json({error: "Enter the City Name"})
        }else{
            next()
        }
    }
}

module.exports = cityMiddleware