import test                from 'ava';
import { Car }            from '../car.js';
import { HelperFunctions } from './helper_functions.js'

test('update single car attribute', async t => {
  const car           = new Car(HelperFunctions.carParams());
  const {updatedAt}   = car;
  const updatedParams = {model: "VW"};
  const updatedCar    = await new Promise( (resolve) => setTimeout(() => resolve(Car.updateCar(car._id, updatedParams)), 1000));

  t.deepEqual({...updatedCar}, {...car, ...updatedParams});
  t.not(updatedCar.updatedAt, updatedAt);
  t.deepEqual(Object.keys(car).sort(), HelperFunctions.carAttributes().sort());
});

test('update multiple car attribute', async t => {
  const car           = new Car(HelperFunctions.carParams());
  const {updatedAt}   = car
  const updatedParams = {model: "VW", color: "BLACK"};
  const updatedCar    = await new Promise( (resolve) => setTimeout(() => resolve(Car.updateCar(car._id, updatedParams)), 1000));

  t.deepEqual({...updatedCar}, {...car, ...updatedParams});
  t.not(updatedCar.updatedAt, updatedAt);
  t.deepEqual(Object.keys(car).sort(), HelperFunctions.carAttributes().sort());
});

test('update location and check updated distance', async t => {
  const car           = new Car(HelperFunctions.carParams());
  const {updatedAt}   = car;
  const oldLocation = car.location;
  const newLocation = {location: {x: 20, y: 28}};
  const updatedCar    = await new Promise( (resolve) => setTimeout(() => resolve(Car.updateCar(car._id, newLocation)), 1000));

  t.deepEqual({...updatedCar}, {...car, ...newLocation});
  t.is(car.traveledDistance, Math.sqrt((oldLocation.x - updatedCar.location.x) * (oldLocation.x - updatedCar.location.x) + 
    (oldLocation.y - updatedCar.location.y) * (oldLocation.y - updatedCar.location.y)))
  t.not(updatedCar.updatedAt, updatedAt);
  t.deepEqual(Object.keys(car).sort(), HelperFunctions.carAttributes().sort());
})

test('inability to update created at', async t => {
  const car         = new Car(HelperFunctions.carParams());
  const {updatedAt} = car
  let updatedParams = {};
  const updatedCar  = await new Promise( (resolve) => setTimeout(() => {
    updatedParams = {createdAt: new Date().toString()};
    resolve(Car.updateCar(car._id, updatedParams))
  } , 1000));

  t.not(updatedCar.updatedAt, updatedAt);
  t.not(car.createdAt, updatedParams.createdAt)
  t.deepEqual(Object.keys(car).sort(), HelperFunctions.carAttributes().sort());
});

test('update non existing car', t => {
  const error = t.throws(() => {
    Car.updateCar("asd", {});
  });

  t.deepEqual(HelperFunctions.sanitizeError(error), ['can not find car with that id']);
});

test('errors work on update', t => {
  const car        = new Car(HelperFunctions.carParams());
  const error = t.throws(() => {
    Car.updateCar(car._id, {
      model:              "PORCHE",
      type:               "VAN",
      color:              "PURPLE",
      infotainmentSystem: "NONE",
      engineNumber:       `-12*&ad`,
      location:           {x: -4, y: 101},
      isLeatherInterior:  undefined,
    });
  });

  t.deepEqual(HelperFunctions.sanitizeError(error).sort(), ['each coordinate must be between 0 and 100', 
                                                            'each coordinate must be between 0 and 100', 
                                                            'engin number must be 8 characters',
                                                            'isLeatherInterior can only be a boolean',
                                                            'you can only get one of these colors: RED - GREEN - BLACK - BLUE',
                                                            'you can only get one of these models: BMW - VW - MERCEDES',
                                                            'you can only get one of these systems: CD - CASSETTE - BLUETOOTH',
                                                            'you can only get one of these types: SEDAN - SUV - CABRIOLET',
                                                            'engine numbers can only have [numbers - dashes - letters]'].sort());
});

