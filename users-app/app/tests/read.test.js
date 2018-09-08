import test                from 'ava';
import { User }            from '../user.js';
import { HelperFunctions } from './helper_functions.js'

test('read user', t => {
  const user = new User(HelperFunctions.userParams());
  t.deepEqual(User.getUser(user._id), user);
  t.deepEqual(Object.keys(user).sort(), HelperFunctions.userAttributes().sort());
});

test('get non existing user', t => {
  const error = t.throws(() => {
    User.getUser("asd");
  });

  t.deepEqual(HelperFunctions.sanitizeError(error), ['can not find user with that id']);
});