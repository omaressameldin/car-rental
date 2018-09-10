const { router, get } = require('microrouter');
const {  send }       = require('micro');
const { Scheduler }   = require('./scheduler.js');

function sendOutput(res, fn) {
  try {
    send(res, 200, fn());
  } catch (err) {
    send(res, 422, {errors: err})
  }
}

module.exports = router(
  get('/schedule', (_, res) => {
    sendOutput(res, () =>{ return {schedule: new Scheduler()} });
  }),
);