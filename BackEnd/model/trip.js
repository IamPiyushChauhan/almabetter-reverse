const database = require('../Connect')
let  trip = undefined
try{
    if(database!== undefined){
        trip = database.collection('trips');
    }else {
        console.log("database is undefined")
    }
    
    
}catch (err){
    console.log(err)
}

module.exports = trip



