'use strict';

const debug = require('debug')('brewBuddy:app-error');
const httpErrors = require('http-errors');

module.exports = function(err, req, res, next) {
  debug('building app error');
  console.error(`${err.message} -- ${err.name}`);
  if (err.status && err.name) {
    res.status(err.status).send(err.name);
    next();
    return;
  }

  const httpErr = httpErrors(500, err.message);
  res.status(httpErr.status).send(httpErr.name);
};
