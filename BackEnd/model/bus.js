const database = require('../Connect')
let  bus = undefined

try{
    if(database!==undefined){
        bus = database.collection('bus');
    }else{
        console.log("database is undefined")
    }
}catch (e){
    console.log(e)
}

module.exports  = bus 