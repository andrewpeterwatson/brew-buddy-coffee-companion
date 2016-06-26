'user strict';

const mongoose = require('mongoose');

const flavorSchema = mongoose.Schema({
  category: {type: String, required: true}
  , flavorType: {type: String, required: true}
  , title: { type: String, required: true}
});

module.exports = mongoose.model('flavor', flavorSchema);
