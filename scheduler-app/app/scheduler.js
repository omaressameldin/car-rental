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

  static isCarAvailable(car, demand, matchings) {
    return true;
  }

  static getBestMatching(demands, remainingCars, demandsIndex, carsIndex, matchingsDistanceObject) {
    if (demandsIndex == demands.length) {
      return matchingsDistanceObject;
    }

    const distanceIfTaken    = Scheduler.calculateDistance({x: demands[demandsIndex].pickupLocation.xPickup, y: demands[demandsIndex].pickupLocation.yPickup} , remainingCars[carsIndex].location);
    const newRemainingCars   = remainingCars.slice(0,carsIndex).concat(remainingCars.slice(carsIndex + 1));
    const addedMatching      = {demand: demands[demandsIndex], car: remainingCars[carsIndex]};
    const newMatchingsObject = {totalDistanceToPickup: matchingsDistanceObject.totalDistanceToPickup + distanceIfTaken, matchings: matchingsDistanceObject.matchings.concat(addedMatching)};
    const canMatch           = Scheduler.doFeaturesMatch(remainingCars[carsIndex], demands[demandsIndex]) && Scheduler.isCarAvailable(remainingCars[carsIndex], demands[demandsIndex], matchingsDistanceObject);

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
    let matchingsIfTaken ;
    let matchingsIfNotTaken;
    
    if(canMatch) {
      try {
        matchingsIfTaken = Scheduler.getBestMatching(demands, newRemainingCars, demandsIndex + 1, 0, newMatchingsObject);
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
      throw("Can not schedule the cars!")
    }

  }

    constructor() {
    const cars    = [{location: {x: 1, y: 2}}, {location: {x: 2, y: 2}, model: "BMW"}];
    const demands = [{model: "BMW", pickupLocation: {xPickup: 1.6, yPickup: 2 }, dropoffLocation: {xDropoff: 1.6 , yDropoff: 3}}, {pickupLocation: {xPickup: 2, yPickup: 2.5 }, dropoffLocation: {xDropoff: 2 , yDropoff: 3.5}}];      
    if(cars.length < demands.length) {
      throw new Error("cant make a schedule need more cars!")
    }

    this.matchings = Scheduler.getBestMatching(demands, cars, 0, 0, {totalDistanceToPickup: 0, matchings: []});
  }
}

module.exports.Scheduler = Scheduler;

