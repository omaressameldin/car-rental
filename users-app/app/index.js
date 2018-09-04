const { json, send }        = require('micro');
const { router, get, post } = require('microrouter');
const { User, usersDB }     = require('./user.js');

module.exports = router(
  post('/users', async (req, res) => {
    try {
      const body = await json(req);
      send(res, 200, new User(body.user));
    } catch (err) {
      send(res, 500, {errors: err})
    }
  })
)