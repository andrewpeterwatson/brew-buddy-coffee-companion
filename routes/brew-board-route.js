'use strict';

//npm modules
const debug = require('debug')('brewBuddy: entry-router');
const Router = require('express').Router;
//app modules
const parseBearerAuth = require('../lib/parse-bearer-auth'); //update when done
const brewBoardController = require('../controller/brew-board-controller');
const userController = require('../controller/user-controller');
//module constants
const brewBoardRouter = module.exports = new Router();

brewBoardRouter.get('/brewBoard', parseBearerAuth, (req, res, next) => {
  debug('GET /api/brewBoard');
  userController.fetchUser(req.userId)
  .then((user) => {
    return brewBoardController.fetchAllBrewBoardEntries(user.buddies);
  })
  .then((entries) => {
    res.json(entries);
  })
  .catch(next);
});
