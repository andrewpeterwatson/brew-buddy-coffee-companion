'use strict';

const debug = require('debug')('brewBuddy:entry-controller');
const Entry = require('../model/entry-model');
const httpErrors = require('http-errors');

exports.createEntry = function(entryData){
  debug('createEntry');
  return new Promise((resolve, reject) => {
    entryData.createdAt = new Date();
    new Entry(entryData).save()
    .then( entry => resolve(entry))
    .catch( err => reject(httpErrors(400, err.message)));
  });
};

exports.fetchEntry = function(entryId){
  debug('fetchEntry');
  return new Promise((resolve, reject) => {
    Entry.findOne({_id: entryId})
    .then(user => resolve(user))
    .catch(err => reject(httpErrors(400,err.message)));
  });
};

exports.updateEntry = function(entryId, entryData){
  return new Promise((resolve, reject) => {
    if(!entryId){
      var err = httpErrors(400,'bad request');
      return reject(err);
    }
    if(!entryData){
      err = httpErrors(400,'bad request');
      return reject(err);
    }

    Entry.findOneAndUpdate(entryId, entryData)
    .then(() => Entry.findByIdAndUpdate({_id: entryId}))
    .then( entry => resolve(entry))
    .catch( err => reject(httpErrors(400, err.message)));
  });
};

exports.removeOneEntry = function(entryId){
  debug('delete one entry');
  return new Promise ((resolve, reject) => {
    Entry.findByIdAndRemove({_id: entryId})
    .then( entry => resolve(204, entry))
    .catch( err => reject(httpErrors(400, err.message)));
  });
};

exports.removeAllEntries = function(){
  return Entry.remove({});
};
