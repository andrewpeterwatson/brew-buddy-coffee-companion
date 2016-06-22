'use strict';

//npm modules
const debug = require('debug')('brewBuddy: entry-router');
const Router = require('express').Router;
const jsonParser = require('body-parser').json();
//app modules
const parseBearerAuth = require('../lib/parse-bearer-auth'); //update when done
const entryController = require('../controller/entry-controller');
//module constants
const entryRouter = module.exports = new Router();

entryRouter.post('/entry', parseBearerAuth, jsonParser, function(req, res, next){
  debug('Post: /api/entry');
  req.body.userId = req.usrId;
  entryController.createEntry(req.body)
  .then( entry => res.json(entry))
  .catch(next);
});

entryRouter.get('/entry/:id', parseBearerAuth, function(req, res, next){
  debug('Get: /api/entry/:id');
  req.body.userId = req.userId;
  entryController.fetchEntry(req.params.id)
  .then(entry => res.json(entry))
  .catch(next);
});

entryRouter.put('/entry/:id', parseBearerAuth, jsonParser, function(req, res, next){
  debug('PUT: /api/entry/:id');
  req.body.userId = req.userId;
  entryController.updateEntry(req.params.id, req.body)
  .then(entry => res.json(entry))
  .catch(next);
});

entryRouter.delete('/entry/:id', parseBearerAuth, function(req, res, next){
  debug('DELETE: /api/entry/:id');
  req.body.userId = req.userId;
  entryController.removeOneEntry(req.params.id)
  .then(entry => res.json(entry))
  .catch(next);
});
