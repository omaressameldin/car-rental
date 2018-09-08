import test                from 'ava';
import { Car }             from '../car.js';
import { HelperFunctions } from './helper_functions.js'

test('read car', t => {
  const car = new Car(HelperFunctions.carParams());
  t.deepEqual(Car.getCar(car._id), car);
  t.deepEqual(Object.keys(car).sort(), HelperFunctions.carAttributes().sort());
});

test('get non existing car', t => {
  const error = t.throws(() => {
    Car.getCar("asd");
  });

  t.deepEqual(HelperFunctions.sanitizeError(error), ['can not find car with that id']);
});