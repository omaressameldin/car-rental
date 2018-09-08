import test                from 'ava';
import { Demand }          from '../demand.js';
import { HelperFunctions } from './helper_functions.js'

test('read demand', async t => {
  const user   = await HelperFunctions.createUser();
  const demand = await new Demand(HelperFunctions.demandParams({userID: user._id}));
  t.deepEqual(Demand.getDemand(demand._id), demand);
  t.deepEqual(Object.keys(demand).sort(), HelperFunctions.demandAttributes().sort());
});

test('get non existing demand', t => {
  const error = t.throws(() => {
    Demand.getDemand("asd");
  });

  t.deepEqual(HelperFunctions.sanitizeError(error), ['can not find demand with that id']);
});