'use strict';

const Router = require('express').Router;
const debug = require('debug')('brewbuddie:flavor-route');
const jsonParser = require('body-parser').json();
const flavorController = require('../controller/flavor-controller');
// const parserBearerAuth = require('../lib/');//adding in file//


const flavorRouter = module.exports = new Router;

flavorRouter.post('/flavor', jsonParser, function(req, res, next){
  debug('post /flavor');
  flavorController.createFlavor(req.body)
  .then((flavor) => {
    debug('hitting post route');
    res.json(flavor);
  })
  .catch(next);
});


flavorRouter.get('/flavor/:id', function(req, res, next){
  debug('get /flavor/:id');
  flavorController.fetchFlavor(req.params.id)
  .then(flavor => res.json(flavor))
  .catch(next);
});

flavorRouter.put('/flavor/:id', jsonParser, function(req, res, next){
  debug('put /flavor/:id');
  flavorController.updateFlavor(req.params.id, req.body)
  .then(flavor => res.json(flavor))
  .catch(next);
});

flavorRouter.delete('/flavor/:id', function(req, res, next) {
  debug('delete /flavor/:id');
  flavorController.deleteFlavor(req.params.id)
  .then(() => res.status(204).end())
  .catch(next);
});
