'use strict';

const mongoose = require('mongoose');


const brewMethodSchema = mongoose.Schema({
  title: {type: String, required: true}
  , recipe: {type: String, required: true}
  , brewTime: {type: Number, required: true}
  , brewMethodId: {type: mongoose.Schema.ObjectId, required: true}

});

module.exports = mongoose.model('brewMethod', brewMethodSchema);
