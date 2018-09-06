const { json, send }                    = require('micro');
const { router, get, post, patch, del } = require('microrouter');
const { Car }                   = require('./car.js');

function sendOutput(res, fn) {
  try {
    send(res, 200, fn());
  } catch (err) {
    send(res, 500, {errors: err})
  }
}

function carParams(body) {
  return body.car || {}
}

module.exports = router(
  get('/cars', (_, res) => {
    sendOutput(res, () =>{ return {cars: Car.all()} });
  }),

  get('/cars/:id', (req, res) => {
    sendOutput(res, () => Car.getCar(req.params.id));
  }),

  post('/cars', async (req, res) => {
    const body = await json(req);
    sendOutput(res, () =>  new Car(carParams(body)));
  }),

  patch('/cars/:id', async (req, res) => {
    const body = await json(req);
    sendOutput(res, () =>  Car.updateCar(req.params.id, carParams(body)));
  }),

  del('/cars/:id', async (req, res) => {
    sendOutput(res, () => Car.deleteCar(req.params.id));
  })
);