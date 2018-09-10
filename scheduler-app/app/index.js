const { router, get } = require('microrouter');
const {  send }       = require('micro');
const { Scheduler }   = require('./scheduler.js');

function sendOutput(res, fn) {
    send(res, 200, fn());

}

module.exports = router(
  get('/schedule', (_, res) => {
    sendOutput(res, () =>{ return {schedule: new Scheduler()} });
  }),
);