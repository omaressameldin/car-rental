const { json, send }                    = require('micro');
const { router, get, post, patch, del } = require('microrouter');
const { User, usersDB }                 = require('./user.js');

function sendOutput(res, fn) {
  try {
    send(res, 200, fn());
  } catch (err) {
    send(res, 500, {errors: err})
  }
}

module.exports = router(
  get('/users/:id', (req, res) => {
    sendOutput(res, () => User.getUser(req.params.id));
  }),
  post('/users', async (req, res) => {
    const body = await json(req);
    sendOutput(res, () =>  new User(body.user));
  }),
  patch('/users/:id', async (req, res) => {
    const body = await json(req);
    sendOutput(res, () =>  User.updateUser(req.params.id, body.user));
  }),

  del('/users/:id', async (req, res) => {
    sendOutput(res, () => User.deleteUser(req.params.id));
  })
);