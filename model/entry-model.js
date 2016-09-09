'use strict';

const mongoose = require('mongoose');

const entrySchema = mongoose.Schema({
  date: {type: Date, required: false}
  , aromas: {type: [String], required: true}
  , acidityStrength: {type: String, required: false}
  , acidity: {type: String, required: true}
  , body: {type: String, required: true}
  , finish: {type: String, required: true}
  , experience: {type: String, required:true}
  , rating: {type: Number, min: 1, max: 4, required:true}
  , username: {type: String, required: false}
  , methodId: {type: String, required: false}
  , originId: {type: String, required: false}
  , flavorId: {type: Array, required: false}
  , privacy: {type: Boolean, default: true}
});

module.exports =  mongoose.model('entry', entrySchema);
