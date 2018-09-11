import test                from 'ava';
const axios =              require('axios');
import { User }            from '../user.js';
import { HelperFunctions } from './helper_functions.js'

test('delete user', async t => {
  const user = new User(HelperFunctions.userParams());
  await User.deleteUser(user._id);
  t.deepEqual(User.all().filter((({_id}) => _id === user._id)), []);
});

test('delete non existing user', async t => {
  const error = await t.throwsAsync(async () => {
    await User.deleteUser("asd");
  });

  t.deepEqual(HelperFunctions.sanitizeError(error), ['can not find user with that id']);
});

test('delete a user that has a demand', async t => {
  const user   = (await axios.post('http://localhost:3000/users', {user: HelperFunctions.userParams()})).data;
  await HelperFunctions.createDemand(user._id);  
  
  const error = await t.throwsAsync(async () => {
    await User.deleteUser(user._id);
  });

  t.deepEqual(HelperFunctions.sanitizeError(error), ['can not delete a user that has a demand']);
});

