'use strict';

const debug = require('debug')('brewBuddy:brew-method-routes');
const Router = require('express').Router;
const jsonParser = require('body-parser').json();

const httpErrors = require('http-errors');
const parseBearerAuth = require('../lib/parse-bearer-auth');
const brewMethodController = require('../controller/brew-method-controller');

const brewMethodRouter = module.exports = new Router();

brewMethodRouter.post('/method', parseBearerAuth, jsonParser, function(req, res, next) {
  debug('POST /api/brewmethod');
  req.body.userId = req.userId;
  brewMethodController.createBrewMethod(req.body)
  .then(brewMethod => res.json(brewMethod))
  .catch(next);
});

brewMethodRouter.get('/method', (req, res, next) => {
  next(httpErrors(400, 'no ID provided'));
});

brewMethodRouter.get('/method/:id', parseBearerAuth, (req, res, next) => {
  debug('brew-method-routes GET');
  brewMethodController.fetchBrewMethod(req.params.id)
  .then(brewMethod => {
    if(!brewMethod) {
      return next(httpErrors(404, 'not found'));
    }
    res.json(brewMethod);
  })
  .catch(next);
});

brewMethodRouter.get('/method/all', parseBearerAuth, jsonParser, (req, res, next) => {
  brewMethodController.fetchAllBrewMethods()
  .then((brewMethod) => {
    res.json(brewMethod);
  })
  .catch(next);
});

brewMethodRouter.put('/method/:id', parseBearerAuth, jsonParser, (req,res,next) => {
  brewMethodController.updateBrewMethod(req.params.id, req.body)
  .then(brewMethod => {
    if(!brewMethod) return next(httpErrors(404, 'not found'));
    res.json(brewMethod);
  })
  .catch(next);
});

brewMethodRouter.delete('/method/:id', parseBearerAuth, (req, res, next) => {
  brewMethodController.removeAllBrewMethods(req.params.id)
  .then(() => {
    res.status(204).send();
  })
  .catch(next);
});
