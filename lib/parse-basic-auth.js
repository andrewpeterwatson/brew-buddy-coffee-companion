'use strict';

const httpErrors = require('http-errors');
const debug = require('debug')('brewbuddie:parse-basic-auth');

module.exports = function(req, res, next) {
  debug ('parsing basic auth');
  if(!req.headers.authorization) next(httpErrors(401, 'must send auth header'));

  let authHeader = req.headers.authorization;
  let namePassword = authHeader.split(' ')[1];

  namePassword = new Buffer(namePassword, 'base64').toString();
  namePassword = namePassword.split(':');
  req.auth = {
    username: namePassword[0],
    password: namePassword[1]
  };

  if (!req.auth.username) return next(httpErrors(401, 'username is require'));
  if (!req.auth.password) return next(httpErrors(401, 'password is require'));
  next();

};
