import test                from 'ava';
import { User }            from '../user.js';
import { HelperFunctions } from './helper_functions.js'

test('update single user attribute', async t => {
  const user        = new User(HelperFunctions.userParams());
  const updatedUser = await new Promise( (resolve) => setTimeout(() => resolve(User.updateUser(user._id, {name: "Mark"})), 100));
  t.deepEqual({...updatedUser}, {...user, updatedAt: new Date(), name: "Mark"});
  t.deepEqual(Object.keys(user).sort(), HelperFunctions.userAttributes().sort());
});

test('update multiple user attribute', async t => {
  const user        = new User(HelperFunctions.userParams());
  const updatedUser = await new Promise( (resolve) => setTimeout(() => resolve(User.updateUser(user._id, {name: "Mark", age: 17})), 100));
  t.deepEqual({...updatedUser}, {...user, updatedAt: new Date(), name: "Mark", age: 17});
  t.deepEqual(Object.keys(user).sort(), HelperFunctions.userAttributes().sort());
});

test('update non existing user', t => {
  const error = t.throws(() => {
    User.updateUser("asd", {});
  });

  t.deepEqual(HelperFunctions.sanitizeError(error), ['can not find user with that id']);
});

test('create errors work on update', t => {
  const user        = new User(HelperFunctions.userParams());
  const error = t.throws(() => {
    User.updateUser(user._id, {name: "", age: -1, gender: "MO"});
  });

  t.deepEqual(HelperFunctions.sanitizeError(error).sort(), ['Name should only contain letters', 
                                                            'Name length has to be more than or equal to 3', 
                                                            'Age must be between 16 and 65', 
                                                            'Gender must be either M or F'].sort());
})
