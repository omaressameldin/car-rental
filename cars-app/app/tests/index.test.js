import test                from 'ava';
import { Car }             from '../car.js';
import { HelperFunctions } from './helper_functions.js'

test('get empty cars', t => {
  t.deepEqual(Car.all(), []);
});

test('get all cars', t => {
  const car = new Car(HelperFunctions.carParams());
  t.deepEqual(Car.all()[0], car);
  t.deepEqual(Object.keys(Car.all()[0]).sort(), HelperFunctions.carAttributes().sort());
});