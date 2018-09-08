import test                from 'ava';
import { Demand }             from '../demand.js';
import { HelperFunctions } from './helper_functions.js'

test('delete demand', async t => {
  const user   = await HelperFunctions.createUser();
  const demand = await new Demand(HelperFunctions.demandParams({userID: user._id}));
  Demand.deleteDemand(demand._id);
  t.deepEqual(Demand.all(), []);
});

test('delete non existing demand', t => {
  const error = t.throws(() => {
    Demand.deleteDemand("asd");
  });

  t.deepEqual(HelperFunctions.sanitizeError(error), ['can not find demand with that id']);
});