const { json, send }                    = require('micro');
const { router, get, post, patch, del } = require('microrouter');
const { User }                          = require('./user.js');

function sendOutput(res, fn) {
  try {
    send(res, 200, fn());
  } catch (err) {
    send(res, 422, {errors: err})
  }
}

function userParams(body) {
  return body.user || {}
}

module.exports = router(
  get('/users', (_, res) => {
    sendOutput(res, () =>{ return {uesrs: User.all()} });
  }),

  get('/users/:id', (req, res) => {
    sendOutput(res, () => User.getUser(req.params.id));
  }),

  post('/users', async (req, res) => {
    const body = await json(req);
    sendOutput(res, () =>  new User(userParams(body)));
  }),

  patch('/users/:id', async (req, res) => {
    const body = await json(req);
    sendOutput(res, () =>  User.updateUser(req.params.id, userParams(body)));
  }),

  del('/users/:id', async (req, res) => {
    sendOutput(res, () => User.deleteUser(req.params.id));
  })
);