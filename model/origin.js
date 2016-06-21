'use strict';

const mongoose = require('mongoose');


const originSchema = mongoose.Schema({
  country: {type: String, required: true}
  ,recMethod: {type: mongoose.Schema.ObjectId, required: true}
  ,originId: {type: mongoose.Schema.ObjectId, required: true}
});

module.exports = mongoose.model('origin', originSchema);
