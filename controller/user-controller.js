'use strict';

const debug = require('debug')('brewBuddy:user-controller');
const User = require('../model/user');
const httpErrors = require('http-errors');

exports.removeAllUsers = function () {
  debug('removeAllUsers');
  return User.remove({});
};

exports.fetchUser = function(userId) {
  debug('fetchUser');
  return new Promise((resolve, reject) => {
    User.findOne({_id: userId})
    .then(user => resolve(user))
    .catch(err => reject(httpErrors(404,err.message)));
  });
};
