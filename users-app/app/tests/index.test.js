import test                from 'ava';
import { User }            from '../user.js';
import { HelperFunctions } from './helper_functions.js'

test('get empty users', t => {
  t.deepEqual(User.all(), []);
});

test('get all users', t => {
  const user = new User(HelperFunctions.userParams());
  t.deepEqual(User.all()[0], user);
  t.deepEqual(Object.keys(User.all()[0]).sort(), HelperFunctions.userAttributes().sort());
});