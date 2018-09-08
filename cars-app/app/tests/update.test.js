import test                from 'ava';
import { Car }            from '../car.js';
import { HelperFunctions } from './helper_functions.js'

test('update single car attribute', async t => {
  const car           = new Car(HelperFunctions.carParams());
  const {updatedAt}   = car;
  const updatedParams = {model: "VW"};
  const updatedCar    = await new Promise( (resolve) => setTimeout(() => resolve(Car.updateCar(car._id, updatedParams)), 100));

  t.deepEqual({...updatedCar}, {...car, ...updatedParams});
  t.not(car.updatedAt, updatedAt);
  t.deepEqual(Object.keys(car).sort(), HelperFunctions.carAttributes().sort());
});

test('update multiple car attribute', async t => {
  const car           = new Car(HelperFunctions.carParams());
  const {updatedAt}   = car
  const updatedParams = {model: "VW", color: "BLACK"};
  const updatedCar    = await new Promise( (resolve) => setTimeout(() => resolve(Car.updateCar(car._id, updatedParams)), 100));

  t.deepEqual({...updatedCar}, {...car, ...updatedParams});
  t.not(car.updatedAt, updatedAt);
  t.deepEqual(Object.keys(car).sort(), HelperFunctions.carAttributes().sort());
});

test('inability to update created at', async t => {
  const car         = new Car(HelperFunctions.carParams());
  const {updatedAt} = car
  let updatedParams = {};
  const updatedCar  = await new Promise( (resolve) => setTimeout(() => {
    updatedParams = {createdAt: new Date()};
    resolve(Car.updateCar(car._id, updatedParams))
  } , 100));

  t.not(car.updatedAt, updatedAt);
  t.not(car.createdAt, updatedParams.createdAt)
  t.deepEqual(Object.keys(car).sort(), HelperFunctions.carAttributes().sort());
});

test('update non existing car', t => {
  const error = t.throws(() => {
    Car.updateCar("asd", {});
  });

  t.deepEqual(HelperFunctions.sanitizeError(error), ['can not find car with that id']);
});

test('create errors work on update', t => {
  const car        = new Car(HelperFunctions.carParams());
  const error = t.throws(() => {
    Car.updateCar(car._id, {name: "", age: -1, gender: "MO"});
  });

  t.deepEqual(HelperFunctions.sanitizeError(error).sort(), ['Name should only contain letters', 
                                                            'Name length has to be more than or equal to 3', 
                                                            'Age must be between 16 and 65', 
                                                            'Gender must be either M or F'].sort());
});

