'use strict';

process.env.APP_SECRET = process.env.APP_SECRET || 'brew method secret';
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/test';

const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const debug = require('debug')('brewBuddy:brew-method-route-test');

const brewMethodController = require('../controller/brew-method-controller');
const authController = require('../controller/auth-controller');
const userController = require('../controller/user-controller');

const port = process.env.PORT || 3000;
const baseUrl = `localhost:${port}/api`;
const server = require('../server');
request.use(superPromise);

describe('testing brew-method-routes', function() {
  before((done) => {
    debug('before module brew-method-routes');
    if(!server.isRunning) {
      server.listen(port, () => {
        server.isRunning = true;
        done();
      });
      return;
    }
    done();
  });

  after((done) => {
    if(server.isRunning) {
      server.close(() => {
        server.isRunning = false;
        done();
      });
      return;
    }
    done();
  });

  describe('testing module brew-method-router', function() {
    beforeEach((done) => {
      authController.signup({username: 'troll', password: 'trollToe'})
      .then((token) => {
        this.tempToken = token;
        return token;
      })
      .then(token => {
        return request.post(`${baseUrl}/method`)
        .send({
          title: 'Kalita Wave'
          , recipe: 'The right way'
          , brewRatio: 3
          , brewTimer: 2
        })
        .set({
          Authorization: `Bearer ${token}`
        })
        .then(res => {
          this.tempBrewMethod = res.body;
          done();
        }).catch(done);
      });
    });

    afterEach((done) => {
      Promise.all([
        userController.removeAllUsers()
        ,brewMethodController.removeAllBrewMethods()
      ])
      .then(() => done())
      .catch(done);
    });

    describe('testing POST on /api/method', () => {
      it('should return a brew-method', (done) => {
        request.post(`${baseUrl}/method`)
        .send({
          title: 'Kalita Wave'
          , recipe: 'The right way'
          , brewRatio: 3
          , brewTimer: 2
        })
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .then(res => {
          expect(res.status).to.equal(200);
          done();
        }).catch(done);
      });

      it('should return a 401', (done) => {
        request.post(`${baseUrl}/method`)
        .send({
          title: 'Kalita Wave'
          , recipe: 'The right way'
          , brewRatio: 3
          , brewTimer: 2
        })
        .then(done)
        .catch(err => {
          const res = err.response;
          expect(res.status).to.equal(401);
          done();
        });
      });


      it('should return a 400, BAD REQUEST', (done) => {
        request.post(`${baseUrl}/method`)
        .send({
          title: 'bad',
          recipe: 'request',
          brewRatio: 3,
          brewTimer: null
        })
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .then(done)
        .catch(err => {
          const res = err.response;
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('testing GET api/method/:id', () => {
      it('should return a brew method', (done) => {
        request.get(`${baseUrl}/method/${this.tempBrewMethod._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .then(res => {
          expect(res.status).to.equal(200);
          done();
        })
        .catch(done);
      });

      it('should return a 401', (done) => {
        request.get(`${baseUrl}/method/${this.tempBrewMethod._id}`)
        .then(done)
        .catch(err => {
          const res = err.response;
          expect(res.status).to.equal(401);
          done();
        });
      });

      it('should return a 404 NOT FOUND', (done) => {
        request.get(`${baseUrl}/method/badroute`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .then(done)
        .catch(err => {
          const res = err.response;
          expect(res.status).to.equal(404);
          done();
        });
      });

      it('should return a 400 BAD REQUEST', (done) => {
        request.get(`${baseUrl}/method`)
        .then(done)
        .catch(err => {
          const res = err.response;
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('testing PUT at api/method/:id', () => {
      it('should return a new brew-method', (done) => {
        request.put(`${baseUrl}/method/${this.tempBrewMethod._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .send({
          title: 'Kalita Wave',
          recipe: 'The right way',
          brewRatio: 3,
          brewTimer: 2
        })
        .then(res => {
          expect(res.status).to.equal(200);
          done();
        }).catch(done);
      });

      it('should return a 401', (done) => {
        request.put(`${baseUrl}/method/${this.tempBrewMethod._id}`)
        .send({
          title: 'Kalita Wave',
          recipe: 'The right way',
          brewRatio: 3,
          brewTimer: 2
        })
        .then(done)
        .catch(err => {
          const res =err.response;
          expect(res.status).to.equal(401);
          done();
        });
      });

      it('should return a 400', (done) => {
        request.put(`${baseUrl}/method/${this.tempBrewMethod._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .catch(err => {
          const res = err.response;
          expect(res.status).to.equal(400);
          done();
        });
      });

      it('should return a 404', (done) => {
        request.put(`${baseUrl}/method/badroute`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .send({
          title: 'Kalita Wave',
          recipe: 'The right way',
          brewRatio: 3,
          brewTimer: 2
        })
        .then(done)
        .catch(err => {
          const res = err.response;
          expect(res.status).to.equal(404);
          done();
        });
      });
    });

    describe('testing DELETE /api/method/:id', () => {
      it('should return a 204', (done) => {
        request.del(`${baseUrl}/method/${this.tempBrewMethod._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .then(res => {
          expect(res.status).to.equal(204);
          done();
        })
        .catch(done);
      });
    });
  });
});
