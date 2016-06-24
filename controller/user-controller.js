'use strict';

const debug = require('debug')('brewBuddy:user-controller');
const User = require('../model/user');

exports.removeAllUsers = function () {
  debug('removeAllUsers');
  return User.remove({});
};
