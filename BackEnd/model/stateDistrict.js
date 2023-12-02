const database = require('../Connect')
let  stateDistrict = undefined
try{
    if(database!== undefined){
        stateDistrict = database.collection('state_district');
    }else {
        console.log("database is undefined")
    }
}catch (err){
    console.log(err)
}

module.exports = stateDistrict