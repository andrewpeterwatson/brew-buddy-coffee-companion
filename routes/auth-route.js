'use strict';

const Router = require('express').Router;
const debug = require('debug')('brewbuddie:auth-router');
const authController = require('../controller/auth-controller');
const parseBasicAuth = require('../lib/parse-basic-auth');
const jsonParser = require('body-parser').json();

const authRouter = module.exports = new Router();

authRouter.post('/signup', jsonParser, (req, res, next) => {
  debug('posting signup');
  authController.signup(req.body)
  .then(token => res.send(token))
  .catch(next);
});

authRouter.get('/signin', jsonParser, parseBasicAuth, (req, res, next) => {
  debug('signing in');
  authController.signin(req.auth)
  .then(token => res.send(token))
  .catch(next);
});
