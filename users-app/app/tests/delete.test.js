import test                from 'ava';
import { User }            from '../user.js';
import { HelperFunctions } from './helper_functions.js'

test('delete user', t => {
  const user = new User(HelperFunctions.userParams());
  User.deleteUser(user._id);
  t.deepEqual(User.all(), []);
});

test('delete non existing user', t => {
  const error = t.throws(() => {
    User.deleteUser("asd");
  });

  t.deepEqual(HelperFunctions.sanitizeError(error), ['can not find user with that id']);
});