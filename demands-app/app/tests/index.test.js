import test                from 'ava';
import { Demand }          from '../demand.js';
import { HelperFunctions } from './helper_functions.js';

test('get empty demands', t => {
  t.deepEqual(Demand.all(), []);
});

test('get all demands', async t => {
  const user   = await HelperFunctions.createUser();
  const demand = await new Demand(HelperFunctions.demandParams({userID: user._id}));
  t.deepEqual(Demand.all()[0], demand);
  t.deepEqual(Object.keys(Demand.all()[0]).sort(), HelperFunctions.demandAttributes().sort());
});