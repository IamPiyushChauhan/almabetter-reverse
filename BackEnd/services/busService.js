const bus = require('../model/bus')
const { ObjectId } = require('mongodb');

class BusService {

  static async findBus(data) {
    try {
      const buses = await bus.find(data).toArray()
      return buses
    } catch (e) {
      console.log(e)
    }
  }

  static async findBusById(id) {
    try {
      console.log(" findBusById "+id)
      const busData = await bus.find({ "_id": new ObjectId(id) }).toArray();
      
      return busData
    } catch (e) {
      console.log(e)
    }
  }



  static async  #update(no, id) {
    try {
      const filter = { "_id": new ObjectId(id), "seats_details.no": no };
      const options = { upsert: true };
      const updateDoc = { "$set": { "seats_details.$.is_reseved": true }, };
      const result = await bus.updateOne(filter, updateDoc, options);
      console.log(
        `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
      );
      return result.modifiedCount
    } catch (err) {
      console.log(err)
    }
  }

  static async  #updateNoOfSets(no, key, id) {
    try {
      const filter = { "_id": new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = { "$set": { [key]: no }, };
      const result = await bus.updateOne(filter, updateDoc, options);
      console.log(
        `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
      );
      return result.modifiedCount
    } catch (err) {
      console.log(err)
    }
  }


  static async saveAndPrintBill(id, seatNos) {
    
    try {
      const busData = await bus.find({ "_id": new ObjectId(id) }).toArray();
      const seatData = busData[0].seats_details
      let price = 0

      console.log(seatNos)
      let pObj = {}
      for (let i = 0; i < seatNos.length; i++) {
        console.log("FOR LOOP ")
        let sObj = seatData[Number(seatNos[i] - 1)]
        console.log(sObj)
        if (!sObj.is_reseved){

          price = price + sObj.price

          if (pObj[sObj.type] === undefined) {
            pObj[sObj.type] = { qun: 1, price: sObj.price }
          } else {
            const nestedObj = pObj[sObj.type]
            const qun = nestedObj.qun + 1
            pObj[sObj.type] = { ...nestedObj, qun: qun }
          }

        }
      }
      console.log(pObj)
      let price_list = []
      for (const key in pObj) {
        price_list.push(
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: `AC Bus Seat ${key}`,
              },
              unit_amount: pObj[key].price * 100,
            },
            quantity: pObj[key].qun,
          }
        )
      }

      price_list.push(
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "TAX",
            },
            unit_amount: (price * 18),
          },
          quantity: 1,
        }
      )

      console.log(price_list)
      console.log(price)
      return [price_list, price]
    } catch (err) {
      console.log(err)
    }
  }



  static async updateSeats(id, seatNos) {
    console.log("------------------------updateSeats-------------------------")
    let countWindowSets = 0
    let countSeats = 0
    try {
      const busData = await bus.find({ "_id": new ObjectId(id) }).toArray();
      const seatData = busData[0].seats_details
      let price = 0

      const noOfSeats = busData[0].totalSeats
      const noOfWindowSeats = busData[0].totalWindowSeatsAvailable

      console.log(seatNos)
      
      for (let i = 0; i < seatNos.length; i++) {
        console.log("FOR LOOP ")
        let sObj = seatData[Number(seatNos[i] - 1)]
        console.log(sObj)
        if (!sObj.is_reseved) {
          countSeats = countSeats +1 
          BusService.#update(sObj.no, id)
          price = price + sObj.price
          if (sObj.type[1] == "W") {
            countWindowSets = countWindowSets+1
          }
        }
      }

      let totalNoOfSeata = noOfSeats - countSeats
      let totalNoOfWindowSeats = noOfWindowSeats - countWindowSets

      

      BusService.#updateNoOfSets(totalNoOfSeata, "totalSeats", id)
      BusService.#updateNoOfSets(totalNoOfWindowSeats, "totalWindowSeatsAvailable", id)

      
      console.log("------------------------updateSeats-------------------------")
      return true
    } catch (err) {
      console.log("err in update Steats")
      console.log(err)
    }
  }

  static async getTrip(busID, price, seats) {
    try {

      const bus = await bus.find({ "_id": new ObjectId(busID) }).toArray();
      const busData = bus[0]


      const tripData = {
        startTime: busData.startTime,
        endTime: busData.endTime,
        date: busData.data,
        from: `${busData.from}_${busData.fromState}`,
        to: `${busData.to}_${busData.toState}`,
        busName: busData.name,
        category: busData.category,
        animeties_list: busData.animeties_list,
        bus_no: busID,
        busFare: price,
        SeatBooked: seats
      }
      return tripData

    } catch (err) {
      console.log(err)
    }

  }


}


module.exports = BusService


