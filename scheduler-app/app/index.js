const { router, get } = require('microrouter');
const {  send }       = require('micro');
const { Scheduler }   = require('./scheduler.js');

async function sendOutput(res, fn) {
  try {
    send(res, 200, await fn());
  } catch (err) {
    send(res, 422, {errors: err})
  }
}

module.exports = router(
  get('/schedule', async (_, res) => {
    await sendOutput(res, async () =>{ return {schedule: await new Scheduler()} });
  }),
);