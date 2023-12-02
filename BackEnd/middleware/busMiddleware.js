class BusMiddleware{
     static #isValidDate(dateString){
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (dateRegex.test(dateString)) {
          return true
        } else {
          return false
        }
    }

    static isValidData(req,res,next) {
      let data = req.query
      console.log(data)
      console.log(data.from)
      console.log("Middleware")
      if(data.from && data.to && data.fromState && data.toState &&data.date){
          if(data.from==="" || data.to==="" ||data.dromState==="" || data.toState===""|| data.date==""){
            res.status(400).json({error: "empty string is not allowed"})
          }
          let dateStr = data.date
          if(BusMiddleware.#isValidDate(dateStr)){
            const timestamp = new Date(dateStr).getTime();
            req.query.date = timestamp
            next()
          }else{
            res.status(400).json({error: "give date in yyyy-mm-dd"})
          }
          
      }else {
        res.status(400).json({error: "give a valid data"})
      }
  }
}


module.exports  = BusMiddleware