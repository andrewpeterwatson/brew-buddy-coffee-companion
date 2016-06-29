'use strict';

const debug = require('debug')('brewBuddy:origin-router');
const Router = require('express').Router;
const httpErrors = require('http-errors');
const originController = require('../controller/origin-controller');
const parseBearerAuth = require('../lib/parse-bearer-auth');

const originRouter = module.exports = new Router();
const jsonParser = require('body-parser').json();


originRouter.post('/origin', parseBearerAuth, jsonParser, (req, res, next) => {
  debug('POST /api/origin');
  req.body.userId = req.userId;
  originController.createOrigin(req.body)
  .then(origin => res.json(origin))
  .catch(next);
});

originRouter.get('/origin/all', parseBearerAuth, (req, res, next) => {
  debug('GET /api/origin/all');
  originController.fetchAllOrigins()
  .then((origins) => {
    res.json(origins);
  })
  .catch(next);
});

originRouter.get('/origin', (req, res, next) => {
  debug('GET /api/orign');
  next(httpErrors(400, 'no ide provided'));
});


originRouter.get('/origin/:id', parseBearerAuth, (req, res, next) => {
  debug('GET /api/origin/:id', req.params.id);
  originController.fetchOrigin(req.params.id)
  .then(origin => {
    if (!origin) return next(httpErrors(404, 'origin not found'));
    res.json(origin);
  })
  .catch(next);
});

originRouter.put('/origin/:id', parseBearerAuth, jsonParser, (req, res, next) => {
  debug('PUT /api/origin/:id', req.params.id);
  originController.updateOrigin(req.params.id, req.body)
  .then(origin => {
    if(!origin) return next(httpErrors(404, 'origin not found'));
    res.json(origin);
  })
  .catch(next);
});

originRouter.delete('/origin/:id', parseBearerAuth, (req, res, next) => {
  debug('DELETE /api/origin/:id', req.params.id);
  originController.removeOrigin(req.params.id)
  .then(() => res.status(204).send())
  .catch(next);
});
