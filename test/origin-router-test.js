'use strict';

process.env.APP_SECRET = process.env.APP_SECRET || 'illnevertell';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/brewBuddyTest';

const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const debug = require('debug')('brewBuddy:origin-router-test');

const authController = require('../controller/auth-controller');
const userController = require('../controller/user-controller');
const originController = require('../controller/origin-controller');
const methodController = require('../controller/method-controller');

const port = process.env.PORT || 3000;
const baseUrl =  `localhost:${port}/api`;
const server = require('../server');

request.use(superPromise);

describe('testing module origin-router', () => {
  before((done) => {
    debug('before module-auth');
    if(!server.isRunning) {
      server.listen(port, () => {
        server.isRunning = true;
        debug(`server is up ::: ${port}`);
        done();
      });
      return;
    }
    done();
  });

  after((done) => {
    debug('after module auth-router');
    if (server.isRunning) {
      server.close(() => {
        server.isRunning = false;
        debug('server is down');
        done();
      });
      return;
    }
    done();
  });

  describe('testing module origin router', () => {
    beforeEach((done) => {
      authController.signup({username: 'rimraf', password:'fakepassword'})
      .then(token => {
        this.tempToken = token;
        return token;
      })
      .then(token => {
        return request.post(`${baseUrl}/method`)
        .send({
          //need to create method here
        })
        .set({
          Authorization: `Bearer ${token}`
        });
      })
      .then(res => {
        return request.post(`${baseUrl}/origin`)
        .send({
          country: 'CoolCountry',
          reqMethod: res.body._id // method_id
        })
        .set({
          Authorization: `Bearer ${this.tempToken}`
        });
      })
      .then((res) => {
        return this.tempOrigin = res.body;
      })
      .then(() => done())
      .catch(done);
    });

    afterEach((done) => {
      Promise.all([
        userController.removeAllUsers(),
        originController.removeAllOrigins(),
        methodController.removeAllMethods()
      ])
      .then(() => done())
      .catch(done);
    });

    //begin testing here
  });
});
