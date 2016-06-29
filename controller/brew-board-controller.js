'use strict';

const debug = require('debug')('brewBuddy:brew-board-controller');
const Entry = require('../model/entry-model');
const httpErrors = require('http-errors');

exports.fetchAllBrewBoardEntries = function(buddies) {
  debug('fetching all enties marked not Private');
  return new Promise((resolve, reject) => {
    Entry.find({privacy: false, buddies})
    .then(resolve)
    .catch(err => reject(httpErrors(404, err.message)));
  });
};

//need to pull buddies usernames and pull all entries that are marked not private
