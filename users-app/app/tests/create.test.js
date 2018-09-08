import test                from 'ava';
import { User }            from '../user.js';
import { HelperFunctions } from './helper_functions.js'

test('creating user', t => {
  const params = HelperFunctions.userParams();
  const user   = new User(params);

  const {name, age, gender, createdAt, updatedAt, _id} = user
  t.deepEqual({name, age, gender}, params);
  t.true(createdAt instanceof Date);
  t.true(updatedAt instanceof Date);
  t.is(createdAt, updatedAt);
  t.is(_id.length, 10);
});

test('creating user with sanitized name', t => {
  const nameParam = {name: " omar   essam "};
  const params    = HelperFunctions.userParams(nameParam);
  const user      = new User(params)

  t.deepEqual(user.name, "omar essam");
});

test('creating user with below required age', t => {
  const ageParam = {age: -1};
  const params   = HelperFunctions.userParams(ageParam);

  const error = t.throws(() => {
    new User(params);
  });

  t.deepEqual(HelperFunctions.sanitizeError(error), ["Age must be between 16 and 65"]);
});

test('creating user with below above age', t => {
  const ageParam = {age: 150};
  const params   = HelperFunctions.userParams(ageParam);

  const error = t.throws(() => {
    new User(params);
  });

  t.deepEqual(HelperFunctions.sanitizeError(error), ["Age must be between 16 and 65"]);
});

test('creating user with string as age', t => {
  const ageParam = {age: "omar"};
  const params   = HelperFunctions.userParams(ageParam);

  const error = t.throws(() => {
    new User(params);
  });

  t.deepEqual(HelperFunctions.sanitizeError(error), ["Age must be a number"]);
});

test('creating user with missing age', t => {
  const ageParam = {age: undefined};
  const params   = HelperFunctions.userParams(ageParam);

  const error = t.throws(() => {
    new User(params);
  });

  t.deepEqual(HelperFunctions.sanitizeError(error), ["Age must be a number"]);
});

test('creating user with missing name', t => {
  const nameParam = {name: undefined};
  const params    = HelperFunctions.userParams(nameParam);

  const error = t.throws(() => {
    new User(params);
  });

  t.deepEqual(HelperFunctions.sanitizeError(error), ["Name length has to be more than or equal to 3"]);
});

test('creating user with name as numbers', t => {
  const nameParam = {name: 123};
  const params    = HelperFunctions.userParams(nameParam);

  const error = t.throws(() => {
    new User(params);
  });

  t.deepEqual(HelperFunctions.sanitizeError(error), ["Name should only contain letters"]);
});

test('creating user with lower case gender', t => {
  const genderParam = {gender: "f"};
  const params      = HelperFunctions.userParams(genderParam);
  const user        = new User(params);

  t.is(user.gender, "F");
});

test('creating user with wrong gender', t => {
  const genderParam = {gender: "MO"};
  const params      = HelperFunctions.userParams(genderParam);

  const error = t.throws(() => {
    new User(params);
  });

  t.deepEqual(HelperFunctions.sanitizeError(error), ["Gender must be either M or F"]);
});

test('creating user with missing gender', t => {
  const genderParam = {gender: undefined};
  const params      = HelperFunctions.userParams(genderParam);

  const error = t.throws(() => {
    new User(params);
  });

  t.deepEqual(HelperFunctions.sanitizeError(error), ["Gender must be either M or F"]);
});

test('stacking errors', t => {
  const genderParam = {gender: undefined, name: undefined};
  const params      = HelperFunctions.userParams(genderParam);

  const error = t.throws(() => {
    new User(params);
  });

  t.deepEqual(HelperFunctions.sanitizeError(error).sort(), ["Gender must be either M or F", "Name length has to be more than or equal to 3"].sort());
});