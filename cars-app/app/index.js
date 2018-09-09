const { json, send }                    = require('micro');
const micro                             = require('micro');
const { router, get, post, patch, del } = require('microrouter');
const { Car }                           = require('./car.js');
const socketIo                          = require("socket.io");

function sendOutput(res, fn) {
  try {
    send(res, 200, fn());
  } catch (err) {
    send(res, 422, {errors: err.message.split(",")})
  }
}

function carParams(body) {
  return body.car || {}
}

function updateCar(id, body) {
  const updatedCar = Car.updateCar(id, carParams(body));
  io.emit("CarUpdated", {...updatedCar});
  return updatedCar;
}

const routes = router(
  get('/cars', (_, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    sendOutput(res, () =>{ return {cars: Car.all()} });
  }),

  get('/cars/:id', (req, res) => {
    sendOutput(res, () => Car.getCar(req.params.id));
  }),

  post('/cars', async (req, res) => {
    const body = await json(req);
    sendOutput(res, () => {
      const newCar = new Car(carParams(body));
      io.emit("CarCreated", {...newCar}); 
      return newCar
    });
  }),

  patch('/cars/:id', async (req, res) => {
    const body = await json(req);
    sendOutput(res, () => updateCar(req.params.id, body));
  }),

  del('/cars/:id', async (req, res) => {
    sendOutput(res, () => Car.deleteCar(req.params.id));
  })
);

const server = micro(routes);
const io     = socketIo(server);

server.listen(3000, () => console.log('Listening on localhost:3000'));