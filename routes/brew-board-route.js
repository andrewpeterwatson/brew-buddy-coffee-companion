'use strict';

//npm modules
const debug = require('debug')('brewBuddy: entry-router');
const Router = require('express').Router;
//app modules
const parseBearerAuth = require('../lib/parse-bearer-auth'); //update when done
const brewBoardController = require('../controller/brew-board-controller');
//module constants
const brewBoardRouter = module.exports = new Router();

brewBoardRouter.get('/brewBoard', parseBearerAuth, (req, res, next) => {
  debug('GET /api/entry/brewBoard');
  brewBoardController.fetchAllBrewBoardEntries()
  .then((entries) => {
    res.json(entries);
  })
  .catch(next);
});
