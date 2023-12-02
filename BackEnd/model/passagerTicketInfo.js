const database = require('../Connect')
let  passagerTicketInfo= undefined

try{
    if(database!==undefined){
        passagerTicketInfo = database.collection('passager_ticket_info');
    }else{
        console.log("database is undefined")
    }
}catch (e){
    console.log(e)
}

module.exports = passagerTicketInfo