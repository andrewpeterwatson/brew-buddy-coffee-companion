'use strict';

const debug = require('debug')('brewbuddie:user-controller');
const User = require('../model/user');

exports.removeAllUsers = function () {
  debug('removeAllUsers');
  return User.remove({});
};
