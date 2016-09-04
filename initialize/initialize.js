'use strict';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/authdev';

const mongoose = require('mongoose');
mongoose.connect(MONGODB_URI, (err) => {
  if (err) throw err;
  console.log('mongoose connection established');
});


const originController = require('../controller/origin-controller');
const originData = require('../data/origin-data.json');

const brewMethodController = require('../controller/brew-method-controller');
const brewMethodData = require('../data/brew-method-data.json');

const flavorController = require('../controller/flavor-controller');
const fruitsFloralData = require('../data/flavor-fruitsAndFloral-data.json');
const sugarsSpiceData = require('../data/flavor-sugarsAndSpice-data.json');
const otherData = require('../data/flavor-other-data.json');


module.exports = populateOrigin;
module.exports = populateBrewMethod;
module.exports = populateFlavor;



function populateBrewMethod(){
  brewMethodData.forEach((brewMethod) => {
    brewMethodController.createBrewMethod(brewMethod)
      .then((dbBrewMethod) => {
        console.log(dbBrewMethod);
      });
  });
}

function populateOrigin(){
  originData.forEach((origin) => {
    originController.createOrigin(origin)
      .then((dbOrigin) => {
        console.log(dbOrigin);
      });
  });
}

function populateFlavor(flavorArr){
  flavorArr.forEach((fruitsFloralData) => {
    flavorController.createFlavor(fruitsFloralData)
      .then((dbFlavors) => {
        console.log(dbFlavors);
      });
  });
}

populateOrigin();
populateBrewMethod();
populateFlavor(fruitsFloralData);
populateFlavor(sugarsSpiceData);
populateFlavor(otherData);
mongoose.connection.close();
