import test                from 'ava';
import { Demand }          from '../demand.js';
import { HelperFunctions } from './helper_functions.js'

test('update single demand attribute', async t => {
  const user          = await HelperFunctions.createUser();
  const demand        = await new Demand(HelperFunctions.demandParams({userID: user._id}));
  const {updatedAt}   = demand;
  const updatedParams = {pickupLocation: {xPickup: 1, yPickup: 18}};
  const updatedDemand = await new Promise( (resolve) => setTimeout(() => resolve(Demand.updateDemand(demand._id, updatedParams)), 1000));

  t.deepEqual({...updatedDemand}, {...demand, ...updatedParams});
  t.not(demand.updatedAt, updatedAt);
  t.deepEqual(Object.keys(demand).sort(), HelperFunctions.demandAttributes().sort());
});

test('update multiple demand attribute', async t => {
  const user          = await HelperFunctions.createUser();
  const demand        = await new Demand(HelperFunctions.demandParams({userID: user._id}));
  const {updatedAt}   = demand
  const updatedParams = {model: "VW", dropoffTime: new Date(new Date().setDate(new Date().getDate() + 10)).toString()};
  const updatedDemand = await new Promise( (resolve) => setTimeout(() => resolve(Demand.updateDemand(demand._id, updatedParams)), 1000));

  t.deepEqual({...updatedDemand}, {...demand, ...updatedParams});
  t.not(updatedDemand.updatedAt, updatedAt);
  t.deepEqual(Object.keys(demand).sort(), HelperFunctions.demandAttributes().sort());
});

test('inability to update created at', async t => {
  const user        = await HelperFunctions.createUser();
  const demand      = await new Demand(HelperFunctions.demandParams({userID: user._id}));
  const {updatedAt} = demand
  let updatedParams = {};
  const updatedDemand  = await new Promise( (resolve) => setTimeout(() => {
    updatedParams = {createdAt: new Date().toString()};
    resolve(Demand.updateDemand(demand._id, updatedParams))
  } , 1000));

  t.not(updatedDemand.updatedAt, updatedAt);
  t.not(demand.createdAt, updatedParams.createdAt)
  t.deepEqual(Object.keys(demand).sort(), HelperFunctions.demandAttributes().sort());
});

test('update non existing demand', t => {
  const error = t.throws(() => {
    Demand.updateDemand("asd", {});
  });

  t.deepEqual(HelperFunctions.sanitizeError(error), ['can not find demand with that id']);
});

test('errors work on update', async t => {
  const user    = await HelperFunctions.createUser();
  const demand  = await new Demand(HelperFunctions.demandParams({userID: user._id}));

  const error =  await t.throwsAsync(async () => {
    await Demand.updateDemand(demand._id, {
      userID:             "asd",
      model:              "PORCHE",
      type:               "VAN",
      color:              "PURPLE",
      infotainmentSystem: "NONE",
      pickupTime:         new Date().toString(),
      dropoffTime:        new Date().toString(),
      pickupLocation:     {xPickup: -4, yPickup: 101},
      dropoffLocation:    {xDropoff: -4, yDropoff: 101},      
      isLeatherInterior:  undefined,
    });
  });

  t.deepEqual(HelperFunctions.sanitizeError(error).sort(), ["can not find user with that id",
                                                            "you can only get one of these models: BMW - VW - MERCEDES",
                                                            "you can only get one of these types: SEDAN - SUV - CABRIOLET",
                                                            "you can only get one of these colors: RED - GREEN - BLACK - BLUE",
                                                            "you can only get one of these systems: CD - CASSETTE - BLUETOOTH",
                                                            "isLeatherInterior can only be a boolean",
                                                            "each coordinate must be between 0 and 100",
                                                            "each coordinate must be between 0 and 100",
                                                            "each coordinate must be between 0 and 100",
                                                            "each coordinate must be between 0 and 100"].sort());
});



