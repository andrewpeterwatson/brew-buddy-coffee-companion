'use strict';

const Flavor = require('../model/flavor-model');
const debug = require('debug')('brewbuddie:flavor-controller');
const httpErrors = require('http-errors');


exports.createFlavor = function(reqBody) {
  debug('createFlavor');
  return new Promise((resolve, reject) =>{
    new Flavor(reqBody)
    .save()
    .then((flavor) => {
      resolve(flavor);
    })
    .catch(err => reject(httpErrors(400, err.message)));
  });
};

exports.fetchFlavor = function(flavorId) {
  debug('fetchFlavor');
  return new Promise((resolve, reject) => {
    Flavor.findOne({_id: flavorId})
    .then(flavor => resolve(flavor))
    .catch(err => reject(httpErrors(400, err.message)));
  });
};

exports.removeAllFlavor = function() {
  return Flavor.remove({});
};

exports.updateFlavor = function(flavorId, reqBody) {
  debug('updateFlavor', reqBody);
  return new Promise((resolve, reject) => {
    if(!reqBody) return reject(httpErrors(400, 'no body provided'));
    if(Object.keys(reqBody).length === 0) return reject(httpErrors(400, 'no body provided'));
    Flavor.findByIdAndUpdate(flavorId, reqBody)
    .then(() => Flavor.findOne({_id: flavorId}))
    .then(flavor => resolve(flavor))
    .catch(reject);
  });
};

exports.deleteFlavor = function(flavorId) {
  debug('deleteFlavor');
  return new Promise((resolve, reject) => {
    Flavor.findByIdAndRemove({_id: flavorId})
    .then(flavor => resolve(flavor))
    .catch(err => reject(httpErrors(400, err.message)));
  });
};
