const { json, send }                    = require('micro');
const { router, get, post, patch, del } = require('microrouter');
const { Demand }                          = require('./demand.js');

async function sendOutput(res, fn) {
  try {
    send(res, 200, await fn());
  } catch (err) {
    send(res, 422, {errors: err})
  }
}

function demandParams(body) {
  return body.demand || {}
}

module.exports = router(
  get('/demands', async (_, res) => {
    await sendOutput(res, () =>{ return {demands: Demand.all()} });
  }),

  get('/demands/:id', async (req, res) => {
    await sendOutput(res, () => Demand.getDemand(req.params.id));
  }),

  post('/demands', async (req, res) => {
    const body = await json(req);
    await sendOutput(res,  async () => await new Demand(demandParams(body))  );
  }),

  patch('/demands/:id', async (req, res) => {
    const body = await json(req);
    await sendOutput(res, () =>  Demand.updateDemand(req.params.id, demandParams(body)));
  }),

  del('/demands/:id', async (req, res) => {
    await sendOutput(res, () => Demand.deleteDemand(req.params.id));
  })
);