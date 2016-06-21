'user strict';

const mongoose = require('mongoose');

const flavorSchema = mongoose.Schema({
  title: { type: String, required: true}
  , flavor: {type: String, required: true}
  , name: { String, required: true}
  , adjective: {Array, required: true}
});

module.exports = mongoose.model('flavor', flavorSchema);
