'use strict';

process.env.APP_SECRET = process.env.APP_SECRET || 'illnevertell';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/test';

const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const debug = require('debug')('authlab:auth-router-test');
const userController = require('../controller/user-controller');
const authController = require('../controller/auth-controller');

const port = process.env.PORT || 3000;
const baseURL = `localhost:${port}/api`;
const server = require('../server');

request.use(superPromise);

describe('testing module auth-router', () => {
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

  it('should have a running server', (done) => {
    expect(server.isRunning).to.equal(true);
    done();
  });

  describe('a bad endpoint', () => {
    it('should return a 404 error', (done) => {
      debug('testing bad endpoing');
      request.post(`${baseURL}/fake`)
      .catch((err) => {
        expect(err.response.status).to.equal(404);
        done();
      });
    });
  });

  describe('testing POST /api/signup', () => {
    after((done) => {
      debug('after POST /api/signup');
      userController.removeAllUsers()
      .then(() => done())
      .catch(done);
    });

    it ('should return a token', (done)=> {
      debug('test POST /api/signup');
      request.post(`${baseURL}/signup`)
      .send({
        username: 'rimraf',
        password: 'forever'
      })
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.text.length).to.equal(105);
        done();
      })
      .catch(done);
    });

    it('should return a 400 if no body', (done) =>{
      debug('test POST /api/signup with no body');
      request.post(`${baseURL}/signup`)
      .catch(err => {
        expect(err.response.status).to.equal(400);
        done();
      });
    });

    it('shoudl return a 400 if a bad request is sent', (done) => {
      debug('test POST /api/signup with bad request');
      request.post(`${baseURL}/signup`)
      .send({
        username: 'rimraf'
      })
      .catch(err => {
        expect(err.response.status).to.equal(400);
        done();
      });
    });
  });

  describe('testing GET /api/signin', () => {
    before((done) => {
      debug('before GET /api/signup');
      authController.signup({username: 'rimraf', password:'farmir'})
      .then(() => done())
      .catch(done);
    });

    after((done) => {
      debug('after GET /api/signup');
      userController.removeAllUsers()
      .then(() => done())
      .catch(done);
    });

    it('should return a token', (done) => {
      debug('test GET /api/signin');
      request.get(`${baseURL}/signin`)
      .auth('rimraf', 'farmir')
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.text.length).to.equal(105);
        done();
      })
      .catch(done);
    });

    it('should return a 401 error user is not found', (done)=> {
      request.get(`${baseURL}/signin`)
      .auth('fake', 'user')
      .catch(err => {
        expect(err.response.status).to.equal(401);
        done();
      });
    });
    it('should return a 401 error bad password is sent', (done)=> {
      request.get(`${baseURL}/signin`)
      .auth('rimraf', 'fakepw')
      .catch(err => {
        expect(err.response.status).to.equal(401);
        done();
      });
    });

  });
});
