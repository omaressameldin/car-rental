import test                 from 'ava';
import { Demand }           from '../demand.js';
import { HelperFunctions } from './helper_functions.js'

test('creating demand', async t => {
  const user          = await HelperFunctions.createUser();
  const params        = HelperFunctions.demandParams(HelperFunctions.demandParams({userID: user._id}));
  const demand        = await new Demand(params);

  const {userID, model, type, color, infotainmentSystem, pickupLocation, dropoffLocation, 
    isLeatherInterior, pickupTime, dropoffTime, createdAt, updatedAt, _id} = demand

  t.deepEqual({userID, model, type, color, infotainmentSystem, pickupLocation, dropoffLocation, 
    isLeatherInterior, pickupTime, dropoffTime}, params);
  t.false(isNaN(new Date(createdAt)));
  t.false(isNaN(new Date(updatedAt)));
  t.is(createdAt, updatedAt);
  t.is(_id.length, 10);
});

test('creating demand with lower case model, type, color, infoTainmentSystem', async t => {
  const user          = await HelperFunctions.createUser();
  const userParam     = {userID: user._id};
  const params        = HelperFunctions.demandParams({model: "bmw", type: "cabriolet", color: "blue", infotainmentSystem: "bluetooth", ...userParam});
  const demand        = await new Demand({...params});
  const capitalParams = {...params, model: "BMW", type: "CABRIOLET", color: "BLUE", infotainmentSystem: "BLUETOOTH"}

  const {userID, model, type, color, infotainmentSystem, pickupLocation, dropoffLocation, 
    isLeatherInterior, pickupTime, dropoffTime, createdAt, updatedAt, _id} = demand
  
  t.deepEqual({userID, model, type, color, infotainmentSystem, pickupLocation, dropoffLocation, 
    isLeatherInterior, pickupTime, dropoffTime}, {...capitalParams, ...userParam});
  t.false(isNaN(new Date(createdAt)));
  t.false(isNaN(new Date(updatedAt)));
  t.is(createdAt, updatedAt);
  t.is(_id.length, 10);
});

test('creating demand with non existing user', async t => {
  const params = HelperFunctions.demandParams({userID: "asd"});

  const error = await t.throwsAsync(async () => {
    await new Demand(params);
  });
  t.deepEqual(HelperFunctions.sanitizeError(error), ["can not find user with that id"]);
});

test('creating demand with wrong model', async t => {
  const modelParam = {model: 123};
  const user       = await HelperFunctions.createUser();
  const params     = HelperFunctions.demandParams({...modelParam, userID: user._id});

  const error = await t.throwsAsync(async () => {
    await new Demand(params);
  });
  t.deepEqual(HelperFunctions.sanitizeError(error), ["you can only get one of these models: BMW - VW - MERCEDES"]);
});

test('creating demand with missing model', async t => {
  const modelParam = {model: undefined};
  const user       = await HelperFunctions.createUser();
  const params     = HelperFunctions.demandParams({...modelParam, userID: user._id});

  const error = await t.throwsAsync(async () => {
    await new Demand(params);
  });
  t.deepEqual(HelperFunctions.sanitizeError(error), ["you can only get one of these models: BMW - VW - MERCEDES"]);
});

test('creating demand with missing type', async t => {
  const typeParam = {type: undefined};
  const user      = await HelperFunctions.createUser();
  const params    = HelperFunctions.demandParams({...typeParam, userID: user._id});

  const error = await t.throwsAsync(async () => {
    await new Demand(params);
  });
  t.deepEqual(HelperFunctions.sanitizeError(error), ["you can only get one of these types: SEDAN - SUV - CABRIOLET"]);
});

test('creating demand with wrong type', async t => {
  const typeParam = {type: 123};
  const user      = await HelperFunctions.createUser();
  const params    = HelperFunctions.demandParams({...typeParam, userID: user._id});

  const error = await t.throwsAsync(async () => {
    await new Demand(params);
  });
  t.deepEqual(HelperFunctions.sanitizeError(error), ["you can only get one of these types: SEDAN - SUV - CABRIOLET"]);
});

test('creating demand with missing color', async t => {
  const colorParam = {color: undefined};
  const user      = await HelperFunctions.createUser();
  const params    = HelperFunctions.demandParams({...colorParam, userID: user._id});

  const error = await t.throwsAsync(async () => {
    await new Demand(params);
  });
  t.deepEqual(HelperFunctions.sanitizeError(error), ["you can only get one of these colors: RED - GREEN - BLACK - BLUE"]);
});

test('creating demand with wrong color', async t => {
  const colorParam = {color: 123};
  const user      = await HelperFunctions.createUser();
  const params    = HelperFunctions.demandParams({...colorParam, userID: user._id});

  const error = await t.throwsAsync(async () => {
    await new Demand(params);
  });
  t.deepEqual(HelperFunctions.sanitizeError(error), ["you can only get one of these colors: RED - GREEN - BLACK - BLUE"]);
});

test('creating demand with missing infotainmentSystem', async t => {
  const infotainmentSystemParam = {infotainmentSystem: undefined};
  const user                    = await HelperFunctions.createUser();
  const params                  = HelperFunctions.demandParams({...infotainmentSystemParam, userID: user._id});

  const error = await t.throwsAsync(async () => {
    await new Demand(params);
  });
  t.deepEqual(HelperFunctions.sanitizeError(error), ["you can only get one of these systems: CD - CASSETTE - BLUETOOTH"]);
});

test('creating demand with wrong infotainmentSystem', async t => {
  const infotainmentSystemParam = {infotainmentSystem: 123};
  const user                    = await HelperFunctions.createUser();
  const params                  = HelperFunctions.demandParams({...infotainmentSystemParam, userID: user._id});

  const error = await t.throwsAsync(async () => {
    await new Demand(params);
  });
  t.deepEqual(HelperFunctions.sanitizeError(error), ["you can only get one of these systems: CD - CASSETTE - BLUETOOTH"]);
});

test('creating demand with unpermitted pickupLocation', async t => {
  const locationParam = {pickupLocation: {xPickup: -2, yPickup: 101}};
  const user          = await HelperFunctions.createUser();
  const params        = HelperFunctions.demandParams({...locationParam, userID: user._id});

  const error = await t.throwsAsync(async () => {
    await new Demand(params);
  });
  t.deepEqual(HelperFunctions.sanitizeError(error), ["each coordinate must be between 0 and 100", "each coordinate must be between 0 and 100"]);
});

test('creating demand with xPickup and yPickup coordinates as strings', async t => {
  const locationParam = {pickupLocation: {xPickup: "asd", yPickup: "dsa"}};
  const user          = await HelperFunctions.createUser();
  const params        = HelperFunctions.demandParams({...locationParam, userID: user._id});

  const error = await t.throwsAsync(async () => {
    await new Demand(params);
  });
  t.deepEqual(HelperFunctions.sanitizeError(error), ["each coordinate must be between 0 and 100", "each coordinate must be between 0 and 100"]);
});

test('creating demand with unpermitted dropoffLocation', async t => {
  const locationParam = {dropoffLocation: {xDropoff: -2, yDropoff: 101}};
  const user          = await HelperFunctions.createUser();
  const params        = HelperFunctions.demandParams({...locationParam, userID: user._id});

  const error = await t.throwsAsync(async () => {
    await new Demand(params);
  });
  t.deepEqual(HelperFunctions.sanitizeError(error), ["each coordinate must be between 0 and 100", "each coordinate must be between 0 and 100"]);
});

test('creating demand with xDropoff and yDropoff coordinates as strings', async t => {
  const locationParam = {dropoffLocation: {xDropoff: "asd"}};
  const user          = await HelperFunctions.createUser();
  const params        = HelperFunctions.demandParams({...locationParam, userID: user._id});

  const error = await t.throwsAsync(async () => {
    await new Demand(params);
  });
  t.deepEqual(HelperFunctions.sanitizeError(error), ["each coordinate must be between 0 and 100", "each coordinate must be between 0 and 100"]);
});

test('creating demand with pickupTime more than dropoffTime', async t => {
  const droppoffTimeParam = {dropoffTime: new Date().toString()};
  const user              = await HelperFunctions.createUser();
  const params            = HelperFunctions.demandParams({...droppoffTimeParam, userID: user._id});

  const error = await t.throwsAsync(async () => {
    await new Demand(params);
  });
  t.deepEqual(HelperFunctions.sanitizeError(error), ["dropoff time cant be before pickup time"]);
});

test('creating demand with wrong format dropoffTime', async t => {
  const droppoffTimeParam = {dropoffTime: "november 13th 2018"};
  const user              = await HelperFunctions.createUser();
  const params            = HelperFunctions.demandParams({...droppoffTimeParam, userID: user._id});

  const error = await t.throwsAsync(async () => {
    await new Demand(params);
  });
  t.deepEqual(HelperFunctions.sanitizeError(error), ["times should be in that form: [Month name] [day] [year] [hours]:[minutes]"]);
});

test('creating demand with wrong format pickupTime', async t => {
  const pickupTimeParam = {pickupTime: "november 13th 2018"};
  const user              = await HelperFunctions.createUser();
  const params            = HelperFunctions.demandParams({...pickupTimeParam, userID: user._id});

  const error = await t.throwsAsync(async () => {
    await new Demand(params);
  });
  t.deepEqual(HelperFunctions.sanitizeError(error), ["times should be in that form: [Month name] [day] [year] [hours]:[minutes]"]);
});

test('creating demand with missing isLeatherInterior', async t => {
  const isLeatherInteriorParam = {isLeatherInterior: undefined};
  const user                   = await HelperFunctions.createUser();
  const params                 = HelperFunctions.demandParams({...isLeatherInteriorParam, userID: user._id});

  const error = await t.throwsAsync(async () => {
    await new Demand(params);
  });
  t.deepEqual(HelperFunctions.sanitizeError(error), ["isLeatherInterior can only be a boolean"]);
});

test('creating demand with isLeatherInterior as number', async t => {
  const isLeatherInteriorParam = {isLeatherInterior: 123};
  const user                   = await HelperFunctions.createUser();
  const params                 = HelperFunctions.demandParams({...isLeatherInteriorParam, userID: user._id});

  const error = await t.throwsAsync(async () => {
    await new Demand(params);
  });
  t.deepEqual(HelperFunctions.sanitizeError(error), ["isLeatherInterior can only be a boolean"]);
});

test('stacking errors', async t => {
  const multipleParam = {dropoffLocation: {xDropoff: 1, yDropoff: 150}};
  const params        = HelperFunctions.demandParams(multipleParam);

  const error = await t.throwsAsync(async () => {
    await new Demand(params);
  });
  t.deepEqual(HelperFunctions.sanitizeError(error).sort(), ["can not find user with that id", "each coordinate must be between 0 and 100"].sort());
});