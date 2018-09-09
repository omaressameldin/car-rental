import test                from 'ava';
import { Car }             from '../car.js';
import { HelperFunctions } from './helper_functions.js'

test('creating car', t => {
  const params = HelperFunctions.carParams();
  const car   = new Car(params);

  const {model, type, color, infotainmentSystem, engineNumber, location, isLeatherInterior, traveledDistance, createdAt, updatedAt, _id} = car
  t.deepEqual({model, type, color, infotainmentSystem, engineNumber, location, isLeatherInterior}, params);
  t.is(traveledDistance, 0);
  t.false(isNaN(new Date(createdAt)));
  t.false(isNaN(new Date(updatedAt)));
  t.is(createdAt, updatedAt);
  t.is(_id.length, 10);
});

test('creating car with lower case model, type, color, infoTainmentSystem', t => {
  const params        = HelperFunctions.carParams({model: "bmw", type: "cabriolet", color: "blue", infotainmentSystem: "bluetooth"});
  const car           = new Car({...params});
  const capitalParams = {...params, model: "BMW", type: "CABRIOLET", color: "BLUE", infotainmentSystem: "BLUETOOTH"}

  const {model, type, color, infotainmentSystem, engineNumber, location, isLeatherInterior, createdAt, updatedAt, _id} = car
  t.deepEqual({model, type, color, infotainmentSystem, engineNumber, location, isLeatherInterior}, {...capitalParams});
  t.false(isNaN(new Date(createdAt)));
  t.false(isNaN(new Date(updatedAt)));
  t.is(createdAt, updatedAt);
  t.is(_id.length, 10);
});

test('creating car with wrong model', t => {
  const modelParam = {model: 123};
  const params   = HelperFunctions.carParams(modelParam);

  const error = t.throws(() => {
    new Car(params);
  });
  t.deepEqual(HelperFunctions.sanitizeError(error), ["you can only get one of these models: BMW - VW - MERCEDES"]);
});

test('creating car with missing model', t => {
  const modelParam = {model: undefined};
  const params   = HelperFunctions.carParams(modelParam);

  const error = t.throws(() => {
    new Car(params);
  });
  t.deepEqual(HelperFunctions.sanitizeError(error), ["you can only get one of these models: BMW - VW - MERCEDES"]);
});

test('creating car with missing type', t => {
  const typeParam = {type: undefined};
  const params    = HelperFunctions.carParams(typeParam);

  const error = t.throws(() => {
    new Car(params);
  });
  t.deepEqual(HelperFunctions.sanitizeError(error), ["you can only get one of these types: SEDAN - SUV - CABRIOLET"]);
});

test('creating car with wrong type', t => {
  const typeParam = {type: 123};
  const params    = HelperFunctions.carParams(typeParam);

  const error = t.throws(() => {
    new Car(params);
  });
  t.deepEqual(HelperFunctions.sanitizeError(error), ["you can only get one of these types: SEDAN - SUV - CABRIOLET"]);
});

test('creating car with missing color', t => {
  const colorParam = {color: undefined};
  const params     = HelperFunctions.carParams(colorParam);

  const error = t.throws(() => {
    new Car(params);
  });
  t.deepEqual(HelperFunctions.sanitizeError(error), ["you can only get one of these colors: RED - GREEN - BLACK - BLUE"]);
});

test('creating car with wrong color', t => {
  const colorParam = {color: 123};
  const params     = HelperFunctions.carParams(colorParam);

  const error = t.throws(() => {
    new Car(params);
  });
  t.deepEqual(HelperFunctions.sanitizeError(error), ["you can only get one of these colors: RED - GREEN - BLACK - BLUE"]);
});

test('creating car with missing infotainmentSystem', t => {
  const infotainmentSystemParam = {infotainmentSystem: undefined};
  const params                  = HelperFunctions.carParams(infotainmentSystemParam);

  const error = t.throws(() => {
    new Car(params);
  });
  t.deepEqual(HelperFunctions.sanitizeError(error), ["you can only get one of these systems: CD - CASSETTE - BLUETOOTH"]);
});

test('creating car with wrong infotainmentSystem', t => {
  const infotainmentSystemParam = {infotainmentSystem: 123};
  const params                  = HelperFunctions.carParams(infotainmentSystemParam);

  const error = t.throws(() => {
    new Car(params);
  });
  t.deepEqual(HelperFunctions.sanitizeError(error), ["you can only get one of these systems: CD - CASSETTE - BLUETOOTH"]);
});

test('creating car with missing engineNumber', t => {
  const engineNumberParam = {engineNumber: undefined};
  const params            = HelperFunctions.carParams(engineNumberParam);

  const error = t.throws(() => {
    new Car(params);
  });
  t.deepEqual(HelperFunctions.sanitizeError(error), ["engin number must be 8 characters"]);
});

test('creating car with less than 8 engineNumber characters', t => {
  const engineNumberParam = {engineNumber: "asd123s"};
  const params            = HelperFunctions.carParams(engineNumberParam);

  const error = t.throws(() => {
    new Car(params);
  });
  t.deepEqual(HelperFunctions.sanitizeError(error), ["engin number must be 8 characters"]);
});

test('creating car with unpermitted characters in engineNumber', t => {
  const engineNumberParam = {engineNumber: "asd1ad*&"};
  const params            = HelperFunctions.carParams(engineNumberParam);

  const error = t.throws(() => {
    new Car(params);
  });
  t.deepEqual(HelperFunctions.sanitizeError(error), ["engine numbers can only have [numbers - dashes - letters]"]);
});

test('creating car with already existing engineNumber', t => {
  const car    = new Car(HelperFunctions.carParams());

  const error = t.throws(() => {
    new Car({...car});
  });
  t.deepEqual(HelperFunctions.sanitizeError(error), ["engine number already exists!"]);
});

test('creating car with missing location', t => {
  const locationParam = {location: undefined};
  const params        = HelperFunctions.carParams(locationParam);

  const error = t.throws(() => {
    new Car(params);
  });
  t.deepEqual(HelperFunctions.sanitizeError(error), ["each coordinate must be between 0 and 100", "each coordinate must be between 0 and 100"]);
});

test('creating car with unpermitted location', t => {
  const locationParam = {location: {x: -2, y: 101}};
  const params        = HelperFunctions.carParams(locationParam);

  const error = t.throws(() => {
    new Car(params);
  });
  t.deepEqual(HelperFunctions.sanitizeError(error), ["each coordinate must be between 0 and 100", "each coordinate must be between 0 and 100"]);
});

test('creating car with x and y coordinates as strings', t => {
  const locationParam = {location: {x: "dsa", y: "asd"}};
  const params        = HelperFunctions.carParams(locationParam);

  const error = t.throws(() => {
    new Car(params);
  });
  t.deepEqual(HelperFunctions.sanitizeError(error), ["each coordinate must be between 0 and 100", "each coordinate must be between 0 and 100"]);
});

test('creating car with missing isLeatherInterior', t => {
  const isLeatherInteriorParam = {isLeatherInterior: undefined};
  const params                 = HelperFunctions.carParams(isLeatherInteriorParam);

  const error = t.throws(() => {
    new Car(params);
  });
  t.deepEqual(HelperFunctions.sanitizeError(error), ["isLeatherInterior can only be a boolean"]);
});

test('creating car with isLeatherInterior as number', t => {
  const isLeatherInteriorParam = {isLeatherInterior: 123};
  const params                 = HelperFunctions.carParams(isLeatherInteriorParam);

  const error = t.throws(() => {
    new Car(params);
  });
  t.deepEqual(HelperFunctions.sanitizeError(error), ["isLeatherInterior can only be a boolean"]);
});

test('stacking errors', t => {
  const multipleParam = {model: undefined, location: {x: 1, y: 150}};
  const params      = HelperFunctions.carParams(multipleParam);

  const error = t.throws(() => {
    new Car(params);
  });

  t.deepEqual(HelperFunctions.sanitizeError(error).sort(), ["you can only get one of these models: BMW - VW - MERCEDES", "each coordinate must be between 0 and 100"].sort());
});