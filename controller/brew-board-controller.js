'use strict';

const debug = require('debug')('brewBuddy:brew-board-controller');
const Entry = require('../model/entry-model');
const httpErrors = require('http-errors');

exports.fetchAllBrewBoardEntries = function(buddyArray) {
  debug('fetching all enties marked not Private');
  return new Promise((resolve, reject) => {
    // Entry.aggregate([
    //   {
    //     $match:{
    //       buddies: []
    //     },privacy: false
    //   }])

    Entry.find({username: {$in: buddyArray}, privacy: false})
    .then(resolve)
    .catch(err => reject(httpErrors(404, err.message)));
  });
};


// { tags: { $in: ["appliances", "school"] } },
//{$and:[{buddies: []} ,
