'use strict';

const mongoose = require('mongoose');


const brewMethodSchema = mongoose.Schema({
  title: {type: String, required: true}
  , recipe: {type: String, required: true}
  , brewTimer: {type: Number, required: true}

});

module.exports = mongoose.model('brewMethod', brewMethodSchema);
