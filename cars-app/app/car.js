let carsDB           = [];
let idList           = new Set();
let engineNumberHash = {};

const MAX_COORDINATE                 = 100;
      AVAILABLE_MODELS               = ["BMW", "VW", "MERCEDES"]
      AVAILABLE_TYPES                = ["SEDAN", "SUV", "CABRIOLET"];
      AVAILABLE_COLORS               = ["RED", "GREEN", "BLACK", "BLUE"];
      AVAILABLE_INFOTAINMENT_SYSTEMS = ["CD", "CASSETTE", "BLUETOOTH"];
      ENGINE_NUMBER_LENGTH           = 8

class Car {
  static getCar(id) {
    const foundCar = carsDB.find((car) => car._id === id);
    if(!foundCar) 
      throw new Error(["can not find car with that id"]);
    else
      return foundCar;
  }

  static updateCar(id, params) {
    let car = Car.getCar(id);

    car.buildCar({...car, ...params});
    car.save();

    return car;
  }

  static deleteCar(id) {
    const orignalLength = carsDB.length;

    carsDB = carsDB.filter((car) => car._id !== id);
    if(orignalLength === carsDB.length)
      throw new Error(["can not find car with that id"]);
  }

  static all() {
    return carsDB;
  }

  static sanitizeEngineNumber(engineNumber) {
    if (engineNumber)
      return engineNumber.replace(/\s+/g,' ').trim();
  }

  static changeToUpperCase(param) {
    return param ? param.toUpperCase() : param;
  }

  constructor(params) {
    this.buildCar(params);
    this.save(true);
  }

  buildCar({model, type, color, infotainmentSystem, engineNumber, location, isLeatherInterior}) {
    model              = Car.changeToUpperCase(model);
    type               = Car.changeToUpperCase(type);
    color              = Car.changeToUpperCase(color);
    infotainmentSystem = Car.changeToUpperCase(infotainmentSystem);
    engineNumber       = Car.sanitizeEngineNumber(engineNumber);
    const {x, y}       = location ? location : {x: null, y: null};

    // Note: validation has to come before setting the new params!
    this.errors  = [];
    this.validateModel(model);
    this.validateType(type);
    this.validateColor(color);
    this.validateInfotainmentSystem(infotainmentSystem);
    this.validateEngineNumber(engineNumber);
    this.validateCoordinate(x);
    this.validateCoordinate(y);
    this.validateIsLeatherInterior(isLeatherInterior);
    this.validate();

    this.model              = model;
    this.color              = color;
    this.type               = type;
    this.infotainmentSystem = infotainmentSystem;
    this.engineNumber       = engineNumber;
    this.location           = location;
    this.isLeatherInterior  = isLeatherInterior;

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

  validateEngineNumber(engineNumber) {
    if(engineNumberHash[engineNumber] && engineNumberHash[engineNumber] !== this._id)
      this.errors.push(`engine numbers already exists!`);

    if(!/^[A-Za-z0-9\-]+$/.test(engineNumber))
      this.errors.push('engine numbers can only have [numbers - dashes - letters]');

    if(!engineNumber || engineNumber.length !== ENGINE_NUMBER_LENGTH)
      this.errors.push(`engin number must be ${ENGINE_NUMBER_LENGTH} characters`);
  }

  validateIsLeatherInterior(isLeatherInterior) {
    if(typeof(isLeatherInterior) !== "boolean")
      this.errors.push("isLeatherInterior can only be a boolean");
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
    this.updatedAt = new Date();
    if(isNew) {
      this.createdAt = this.updatedAt;
      this._id        = this.generateID();
      carsDB.push(this);
      idList.add(this._id);
    }
    engineNumberHash[this.engineNumber] = this._id;
  }
}

module.exports.Car    = Car
module.exports.carsDB = carsDB