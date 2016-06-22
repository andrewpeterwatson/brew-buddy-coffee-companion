'use strict';

const debug = require('debug')('brewBuddy:brew-method-controller');
const BrewMethod = require('../model/brew-method');
const httpErrors = require('http-errors');

exports.createBrewMethod= function(brewMethodData) {
  debug('createBrewMethod');
  return new Promise((resolve, reject) => {
    new BrewMethod(brewMethodData).save()
    .then(brewMethod => resolve(brewMethod))
    .catch(err => reject(httpErrors(400, err.message)));
  });
};

exports.fetchBrewMethod = function(brewMethodId) {
  return new Promise((resolve, reject) => {
    BrewMethod.findOne({_id:brewMethodId})
    .then(brewMethod => {
      resolve(brewMethod);
    })
    .catch(() => reject(httpErrors(404, 'brew method not found')));
  });
};

exports.updateBrewMethod = function(brewMethodId, reqBody) {
  return new Promise((resolve, reject) => {
    if(Object.keys(reqBody).length === 0) return reject(httpErrors(400, 'body can not be found'));
    const brewMethodKeys = ['title', 'recipe', 'brewTime'];
    Object.keys(reqBody).forEach((key) => {
      if(brewMethodKeys.indexOf(key) === -1) return reject(httpErrors(400, 'no key provided'));
    });
    BrewMethod.findByIdAndUpdate(brewMethodId, reqBody)
      .then(() => BrewMethod.findOne({_id:brewMethodId})
      .then(resolve))
      .catch(err => reject(httpErrors(404, err.message)));
  });
};

exports.fetchAllBrewMethods = function() {
  return new Promise((resolve, reject) => {
    BrewMethod.find({})
      .then(resolve)
      .catch(reject);
  });
};
exports.removeAllBrewMethods = function() {
  return BrewMethod.remove({});
};
