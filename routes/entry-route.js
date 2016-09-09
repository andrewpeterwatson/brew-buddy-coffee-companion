'use strict';

const debug = require('debug')('brewBuddy: entry-router');
const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const parseBearerAuth = require('../lib/parse-bearer-auth'); //update when done
const entryController = require('../controller/entry-controller');
const httpErrors = require('http-errors');
const entryRouter = module.exports = new Router();

entryRouter.post('/entry', parseBearerAuth, jsonParser, function(req, res, next){
  debug('Post: /api/entry');
  console.log('BE route POST', req.body);
  entryController.createEntry(req.body)
  .then( entry => res.json(entry))
  .catch(next);
});

entryRouter.get('/entry/all/:username', parseBearerAuth, (req, res, next) => {
  debug('GET /api/entry/all/:username');
  entryController.fetchAllEntries(req.params.username)
  .then((entries) => {
    res.json(entries);
  })
  .catch(next);
});

entryRouter.get('/entry/all/', parseBearerAuth, (req, res, next) => {
  debug('GET /api/entry/all/');
  entryController.fetchAllEntries()
  .then((entries) => {
    res.json(entries);
  })
  .catch(next);
});


entryRouter.get('/entry/search', parseBearerAuth, jsonParser, (req, res, next) => {
  debug('GET /api/entry/search');
  debug('query', req.query);

  if (!req.query) return next(httpErrors(400, 'no query found'));
  entryController.searchEntries(req.query)
  .then((entries) => {
    if (entries.length === 0) return res.status(204).send('no entries found');
    res.json(entries);
  })
  .catch(next);
});

entryRouter.get('/entry/:id', parseBearerAuth, function(req, res, next){
  debug('Get: /api/entry/:id');
  entryController.fetchEntry(req.params.id)
  .then(entry => {
    if (!entry) return next(httpErrors(404, 'origin not found'));
    res.json(entry);
  })
  .catch(next);
});

entryRouter.put('/entry/:id', parseBearerAuth, jsonParser, function(req, res, next){
  debug('PUT: /api/entry/username', req.params.id);
  entryController.updateEntry(req.params.id, req.body)
  .then(entry => {
    if(!entry) return next(httpErrors(404, 'origin not found'));
    res.json(entry);
  })
  .catch(next);
});

entryRouter.delete('/entry/:id', parseBearerAuth, function(req, res, next){
  debug('DELETE: /api/entry/:id', req.params.id);
  entryController.removeOneEntry(req.params.id)
  .then(() => res.status(204).send())
  .catch(next);
});
