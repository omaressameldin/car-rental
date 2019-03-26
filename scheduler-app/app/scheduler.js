const axios = require('axios');

class Scheduler {
  static calculateDistance(loc1, loc2) {
    const xDifference = loc1.x - loc2.x;
    const yDifference = loc1.y - loc2.y;
    return Math.sqrt(xDifference * xDifference + yDifference * yDifference);
  }

  static doFeaturesMatch({model, type, color, infotainmentSystem, issLeatherInterior}, demand) {
    return model === demand.model && type === demand.type && color === demand.color &&
      infotainmentSystem === demand.infotainmentSystem && issLeatherInterior === demand.issLeatherInterior
  }

  static isCarAvailable(car, demand, bookedTimes) {
    const carBookings = bookedTimes[car._id];
    carBookings.forEach(booking => {
      if((new Date(booking.pickupTime) <= new Date(demand.pickupTime) && new Date(booking.dropoffTime) >= new Date(demand.pickupTime)) ||
        new Date(booking.pickupTime) <= new Date(demand.dropoffTime) && new Date(booking.dropoffTime) >= new Date(demand.dropoffTime)
      )
        return false;
    });
    return true;
  }

  static getBestMatching(demands, remainingCars, demandsIndex, carsIndex, matchingsDistanceObject) {
    if (demandsIndex == demands.length) {
      return matchingsDistanceObject;
    }
    const car                = remainingCars[carsIndex];
    const demand             = demands[demandsIndex];
    const distanceIfTaken    = Scheduler.calculateDistance({x: demand.pickupLocation.xPickup, y: demand.pickupLocation.yPickup} , car.location);
    const addedMatching      = {demand, car};
    const bookedTimes        = matchingsDistanceObject.bookedTimes;
    const canMatch           = Scheduler.doFeaturesMatch(car, demand) && Scheduler.isCarAvailable(car, demand, bookedTimes);
    const newCarBookedTimes  = bookedTimes[car._id].concat({pickupTime: demand.pickupTime, dropoffTime: demand.dropoffTime});
    const newMatchingsObject = {totalDistanceToPickup: matchingsDistanceObject.totalDistanceToPickup + distanceIfTaken,
      matchings: matchingsDistanceObject.matchings.concat(addedMatching), bookedTimes: {...bookedTimes, [car._id]: newCarBookedTimes}};

    if(remainingCars.length - 1 === carsIndex) {
      if(canMatch) {
        if(demandsIndex === demands.length - 1) {
          return newMatchingsObject;
        }
      } else {
        throw new Error("this path does not work");
      }
    }
    let canTake  = canMatch;
    let canLeave = true;
    let matchingsIfTaken, matchingsIfNotTaken;

    if(canMatch) {
      try {
        matchingsIfTaken = Scheduler.getBestMatching(demands, remainingCars, demandsIndex + 1, 0, newMatchingsObject);
      } catch (error) {
        canTake = false;
      }
    }

    try {
      matchingsIfNotTaken = Scheduler.getBestMatching(demands, remainingCars, demandsIndex, carsIndex + 1, matchingsDistanceObject);
    } catch (error) {
      canLeave = false
    }



    if(canTake && canLeave) {
      return matchingsIfTaken.totalDistanceToPickup < matchingsIfNotTaken.totalDistanceToPickup ? matchingsIfTaken : matchingsIfNotTaken
    } else if(canTake) {
      return matchingsIfTaken
    } else if(canLeave) {
      return matchingsIfNotTaken
    } else {
      throw("Can not schedule the cars!");
    }

  }

    constructor() {
      return (async () => {
        let cars, demands;

        try {
          demands = (await axios.get(`http://demands-app:3000/demands`)).data.demands;
          cars    = (await axios.get(`http://cars-app:3000/cars`)).data.cars;
        } catch (errorResponse) {
          this.errors.push(...errorResponse.response.data.errors);
        }

        if(cars.length < demands.length) {
          throw new Error("cant make a schedule need more cars!")
        }
        const bookedTimes = cars.reduce((bookedTimes, car) =>  ({...bookedTimes, [car._id]: []}), {} );
        this.matchings = Scheduler.getBestMatching(demands, cars, 0, 0, {totalDistanceToPickup: 0, matchings: [], bookedTimes});
        console.log(this);
        return this;
      })();

  }
}

module.exports.Scheduler = Scheduler;

