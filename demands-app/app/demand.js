const axios = require('axios');

let demandsDB = [];
let idList    = new Set();

const MAX_COORDINATE                 = 100;
      AVAILABLE_MODELS               = ["BMW", "VW", "MERCEDES"]
      AVAILABLE_TYPES                = ["SEDAN", "SUV", "CABRIOLET"];
      AVAILABLE_COLORS               = ["RED", "GREEN", "BLACK", "BLUE"];
      AVAILABLE_INFOTAINMENT_SYSTEMS = ["CD", "CASSETTE", "BLUETOOTH"];

class Demand {
  static getDemand(id) {
    const foundDemand = demandsDB.find((demand) => demand._id === id);
    if(!foundDemand) 
      throw new Error(["can not find demand with that id"]);
    else
      return foundDemand;
  }

  static updateDemand(id, params) {
    let demand = Demand.getDemand(id);

    demand.buildDemand({...demand, ...params});
    demand.save();

    return demand;
  }

  static deleteDemand(id) {
    const orignalLength = demandsDB.length;

    demandsDB = demandsDB.filter((demand) => demand._id !== id);
    if(orignalLength === demandsDB.length)
      throw new Error(["can not find demand with that id"]);
  }

  static all() {
    return demandsDB;
  }

  static changeToUpperCase(param) {
    return param ? param.toUpperCase() : param;
  }

  constructor(params) {
    return (async () => {
      await this.buildDemand(params);
      this.save(true);
      return this;
    })();
  }

  async buildDemand({userID, model, type, color, infotainmentSystem, isLeatherInterior, pickupLocation, dropoffLocation, pickupTime, dropoffTime }) {
    model                      = Demand.changeToUpperCase(model);
    type                       = Demand.changeToUpperCase(type);
    color                      = Demand.changeToUpperCase(color);
    infotainmentSystem         = Demand.changeToUpperCase(infotainmentSystem);
    const {xPickup, yPickup}   = pickupLocation  ? pickupLocation  : {xPickup: null, yPickup: null};
    const {xDropoff, yDropoff} = dropoffLocation ? dropoffLocation : {xDropoff: null, yDropoff: null};
    pickupTime                 = new Date(pickupTime);
    dropoffTime                = new Date(dropoffTime);

    // Note: validation has to come before setting the new params!
    this.errors  = [];
    await this.validateUserID(userID);
    this.validateModel(model);
    this.validateType(type);
    this.validateColor(color);
    this.validateInfotainmentSystem(infotainmentSystem);
    this.validateIsLeatherInterior(isLeatherInterior);
    this.validateCoordinate(xPickup);
    this.validateCoordinate(yPickup);
    this.validateCoordinate(xDropoff);
    this.validateCoordinate(yDropoff);
    this.validateTime(pickupTime, dropoffTime);
    this.validate();

    this.userID             = userID;
    this.model              = model;
    this.color              = color;
    this.type               = type;
    this.infotainmentSystem = infotainmentSystem;
    this.isLeatherInterior  = isLeatherInterior;
    this.pickupLocation     = pickupLocation
    this.dropoffLocation    = dropoffLocation;
    this.pickupTime         = pickupTime;
    this.dropoffTime        = dropoffTime;

  }

  async validateUserID(userID) {
    try {
      await axios.get(`http://users-app:3000/users/${userID}`)
    } catch (errorResponse) {
      this.errors.push(...errorResponse.response.data.errors);
    }
  }

  validateModel(model) {
    if (!AVAILABLE_MODELS.includes(model))
      this.errors.push(`you can only get one of these models: ${AVAILABLE_MODELS.join(" - ")}`);
  }
  
  validateType(type) {
    if (!AVAILABLE_TYPES.includes(type))
      this.errors.push(`you can only get one of these types: ${AVAILABLE_TYPES.join(" - ")}`);    
  }

  validateColor(color) {
    if (!AVAILABLE_COLORS.includes(color))
      this.errors.push(`you can only get one of these colors: ${AVAILABLE_COLORS.join(" - ")}`);
  }

  validateInfotainmentSystem(infotainmentSystem) {
    if (!AVAILABLE_INFOTAINMENT_SYSTEMS.includes(infotainmentSystem))
    this.errors.push(`you can only get one of these systems: ${AVAILABLE_INFOTAINMENT_SYSTEMS.join(" - ")}`); 
  }

  validateCoordinate(coordinate) {
    if (!coordinate || isNaN(coordinate) || coordinate <= 0 || coordinate > MAX_COORDINATE)
      this.errors.push(`each coordinate must be between 0 and ${MAX_COORDINATE}`);
  }

  validateIsLeatherInterior(isLeatherInterior) {
    if(typeof(isLeatherInterior) !== "boolean")
      this.errors.push("isLeatherInterior can only be a boolean");
  }

  validateTime(pickupTime, dropoffTime) {
    if(isNaN(pickupTime.getTime()) || isNaN(dropoffTime).getTime)
      this.errors.push("times should be in that form: [Month name] [day], [year] [hours]:[minutes]");
    else if(pickupTime > dropoffTime)
      this.errors.push("dropoff time cant be before pickup time");
  }
  
  validate() {
    const errors = [...this.errors];
    delete this.errors;
    if(errors.length) {
      throw new Error(errors);
    } 
  }

  generateID() {
    let id = null;
    do {
      id = `_${Math.random().toString(36).substr(2, 9)}`;
    } while (idList.has(id));

    return id;
  }

  save(isNew = false) {
    this.updatedAt = new Date().toString();
    if(isNew) {
      this.createdAt = this.updatedAt;
      this._id        = this.generateID();
      demandsDB.push(this);
      idList.add(this._id);
    }
  }
}

module.exports.Demand    = Demand
module.exports.demandsDB = demandsDB