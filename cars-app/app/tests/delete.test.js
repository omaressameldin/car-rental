import test                from 'ava';
import { Car }             from '../car.js';
import { HelperFunctions } from './helper_functions.js'

test('delete car', t => {
  const car = new Car(HelperFunctions.carParams());
  Car.deleteCar(car._id);
  t.deepEqual(Car.all(), []);
});

test('delete non existing car', t => {
  const error = t.throws(() => {
    Car.deleteCar("asd");
  });

  t.deepEqual(HelperFunctions.sanitizeError(error), ['can not find car with that id']);
});