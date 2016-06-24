'use strict';

const mongoose = require('mongoose');

const entrySchema = mongoose.Schema({
  date: {type: Date, required: true}
  , aromas: {type: [String], required: true}
  , acidity: {type: String, required: true}
  , body: {type: String, required: true}
  , finish: {type: String, required: true}
  , experience: {type: String, required:true}
  , rating: {type: Number, min: 1, max: 4, required:true}
  , username: {type: String, required: true}
  , methodId: {type: mongoose.Schema.ObjectId, required: true}
  , originId: {type: mongoose.Schema.ObjectId, required: true}
  //, flavorId: {type: [mongoose.Schema.ObjectId], max: 3, required: true}
});

module.exports =  mongoose.model('entry', entrySchema);
