const axios = require('axios');

class Scheduler {
  static calculateDistance(loc1, loc2) {
    const xDifference = loc1.x - loc2.x;
    const yDifference = loc1.y - loc2.y;
    return Math.sqrt(xDifference * xDifference + yDifference * yDifference);
  }

  static getBestMatching(demands, remainingCars, demandsIndex, carsIndex, matchingsDistanceObject) {
    const distanceIfTaken    = Scheduler.calculateDistance({x: demands[demandsIndex].pickupLocation.xPickup, y: demands[demandsIndex].pickupLocation.yPickup} , remainingCars[carsIndex].location);
    const newRemainingCars   = remainingCars.splice(0,carsIndex).concat(remainingCars.splice(carsIndex + 1));
    const addedMatching      = {demand: demands[demandsIndex], car: remainingCars[carsIndex]};
    const newMatchingsObject = {totalDistanceToPickup: matchingsDistanceObject.totalDistanceToPickup + distanceIfTaken, matchings: matchingsDistanceObject.matchings.concat(addedMatching)};

    if(remainingCars.length - 1 === carsIndex) {
      if(demandsIndex === demands.length - 1) 
        return newMatchingsObject;
      else 
        return Scheduler.getBestMatching(demands, newRemainingCars, demandsIndex + 1, 0, newMatchingsObject);
    }
    const matchingsIfTaken    = Scheduler.getBestMatching(demands, newRemainingCars, demandsIndex + 1, 0, newMatchingsObject);
    const matchingsIfNotTaken = Scheduler.getBestMatching(demands, remainingCars, demandsIndex, carsIndex + 1, matchingsDistanceObject);
    
    if(matchingsIfTaken.totalDistanceToPickup < matchingsIfNotTaken.totalDistanceToPickup)
      return matchingsIfTaken;
    else
      return matchingsIfNotTaken;
  }

    constructor() {
    const cars    = [{location: {x: 1, y: 2}}, {location: {x: 2, y: 2}}];
    const demands = [{pickupLocation: {xPickup: 1.6, yPickup: 2 }, dropoffLocation: {xDropoff: 1.6 , yDropoff: 3}}, {pickupLocation: {xPickup: 2, yPickup: 2.5 }, dropoffLocation: {xDropoff: 2 , yDropoff: 3.5}}];      
    if(cars.length < demands.length) {
      throw new Error("cant make a schedule need more cars!")
    }

    this.matchings = Scheduler.getBestMatching(demands, cars, 0, 0, {totalDistanceToPickup: 0, matchings: []});
  }
}

module.exports.Scheduler = Scheduler;

