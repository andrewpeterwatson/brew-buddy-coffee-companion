'use strict';

const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const debug = require('debug')('brewbuddie:fillData');


request.use(superPromise);

module.exports = function fillData(data, endpoint) {
  debug('fillData');
  for (var i = 0; i < data.length; i++) {
    console.log('POSTING', data[i]);
    request.post(`https://brew-buddy-coffee-stage.herokuapp.com/api/${endpoint}`)
    .set({Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImQ1YzAxY2U0YzczYWE1NDdkYjUyMTA5Y2YyNjkwYzBmZmE3MWQyYmQzNTNjZWVlMTMwMDkwMGM5MDc1MjcyMGEiLCJpYXQiOjE0NjY5NzcyNzV9.i6CYQShRy-DbLukfGkI_MjfrKJoleTNWu0rHVEfiir0'})
    .send(data[i])
    .end((err, res) => {
      if (err) console.log('MY ERROR', err.error);
      console.log('MY RESPONSE', res.status);
    });
  }
};
