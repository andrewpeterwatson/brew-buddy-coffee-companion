'user strict';

const mongoose = require('mongoose');

const flavorSchema = mongoose.Schema({
  flavorType: {type: String, required: true}
  , title: { type: String, required: true}
  , adjective: [{type: String, required: true}]
});

module.exports = mongoose.model('flavor', flavorSchema);
