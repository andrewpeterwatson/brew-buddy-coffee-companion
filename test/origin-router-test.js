'use strict';

process.env.APP_SECRET = process.env.APP_SECRET || 'illnevertell';
process.env.MONGODB_URI = 'mongodb://localhost/brewBuddyTest';

const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const debug = require('debug')('brewBuddy:origin-router-test');

const authController = require('../controller/auth-controller');
const userController = require('../controller/user-controller');
const originController = require('../controller/origin-controller');
const brewMethodController = require('../controller/brew-method-controller');

const port = process.env.PORT || 3000;
const baseUrl =  `localhost:${port}/api`;
const server = require('../server');

request.use(superPromise);

var TOKEN;

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
          title: 'RimRafBrew',
          recipe: 'First Rim. Then Raf. Repeat',
          brewRatio: 3,
          brewTimer: 3
        })
        .set({
          Authorization: `Bearer ${token}`
        });
      })
      .then(res => {
        this.tempBrewMethod = res.body._id;
        done();
      })
      .catch(done);
    });

    afterEach((done) => {
      Promise.all([
        userController.removeAllUsers(),
        originController.removeAllOrigins(),
        brewMethodController.removeAllBrewMethods()
      ])
      .then(() => done())
      .catch(done);
    });

    //begin testing here
    describe('testing /api/origin', () => {
      describe('POST /api/origin', () => {
        it('should return an origin', (done) => {
          request.post(`${baseUrl}/origin`)
          .send({
            country: 'CoolCountry',
            recMethod: this.tempBrewMethod
          })
          .set({
            Authorization: `Bearer ${this.tempToken}`
          })
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body.country).to.equal('CoolCountry');
            done();
          })
          .catch(done);
        });

        it('should return a 400 if no origin is sent', (done) => {
          request.post(`${baseUrl}/origin`)
          .set({
            Authorization: `Bearer ${this.tempToken}`
          })
          .catch((err) => {
            expect(err.response.status).to.equal(400);
            done();
          });
        });

        it('should return a 401 if no token is sent', (done) => {
          request.post(`${baseUrl}/origin`)
          .send({
            country: 'CoolCountry',
            recMethod: this.tempBrewMethod
          })
          .catch((err) => {
            expect(err.response.status).to.equal(401);
            done();
          });
        });
      });

      describe('PUT /api/origin/:id', () => {
        let testOrigin = {};
        before((done) => {
          originController.createOrigin({
            country: 'CoolCountry',
            recMethod: this.tempBrewMethod._id
          })
          .then((origin) => {
            testOrigin = origin;
            done();
          });
        });

        it('should return the modified origin', (done) => {
          request.put(`${baseUrl}/origin/${testOrigin._id}`)
          .send({
            country: 'ShittyCountry'
          })
          .set({
            Authorization: `Bearer ${this.tempToken}`
          })
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body.country).to.equal('ShittyCountry');
            done();
          }).catch(done);
        });

        it('should return 401 if no token is provided', (done) => {
          request.put(`${baseUrl}/origin/${testOrigin._id}`)
          .send({
            country:'ShittyCountry'
          })
          .catch((err) => {
            expect(err.response.status).to.equal(401);
            done();
          });
        });

        it('should return 400 if no origin is sent', (done) => {
          request.put(`${baseUrl}/origin/${testOrigin._id}`)
          .set({
            Authorization: `Bearer ${this.tempToken}`
          })
          .catch((err) => {
            expect(err.response.status).to.equal(400);
            done();
          });
        });

        it('should return 404 if no origin is found', (done) => {
          request.put(`${baseUrl}/origin/fakeOrigin`)
          .send({
            country: 'ShittyCountry'
          })
          .set({
            Authorization: `Bearer ${this.tempToken}`
          })
          .catch((err) => {
            expect(err.response.status).to.equal(404);
            done();
          });
        });

      });
///////////

      describe('GET /api/origin', () => {
        let testOrigin = {};
        before((done) => {
          originController.createOrigin({
            country: 'CoolCountry',
            recMethod: this.tempBrewMethod._id
          })
          .then((origin) => {
            testOrigin = origin;
            done();
          });
        });

        it('should return a origin', (done) => {
          request.get(`${baseUrl}/origin/${testOrigin._id}`)
          .set({
            Authorization: `Bearer ${this.tempToken}`
          })
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body.country).to.equal('CoolCountry');
            done();
          })
          .catch(done);
        });

        it('should return a 404 if no origin is found', (done) => {
          request.get(`${baseUrl}/origin/fakeOrigin`)
          .set({
            Authorization: `Bearer ${this.tempToken}`
          })
          .catch((err) => {
            expect(err.response.status).to.equal(404);
            done();
          });
        });

        it('should return a 401 if no token is sent', (done) => {
          request.get(`${baseUrl}/origin/${testOrigin._id}`)
          .catch((err) => {
            expect(err.response.status).to.equal(401);
            done();
          });
        });
      });

      describe('GET /api/origin/all', () => {
        before((done) => {
          Promise.all([
            originController.createOrigin({
              country: 'CoolCountry',
              recMethod: this.tempBrewMethod._id
            }),
            originController.createOrigin({
              country: 'DumbCountry',
              recMethod: this.tempBrewMethod._id
            })
          ])
          .then(() => done())
          .catch(done);
        });

        it('should return an array of origins', (done) => {
          request.get(`${baseUrl}/origin/all`)
          .set({
            Authorization: `Bearer ${this.tempToken}`
          })
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.equal(2);
            done();
          })
          .catch(done);
        });
      });

      describe('DELETE /api/origin/:id', () => {
        let testOrigin = {};
        before((done) => {
          originController.createOrigin({
            country: 'CoolCountry',
            recMethod: this.tempBrewMethod._id
          })
          .then((origin) => {
            testOrigin = origin;
            done();
          });
        });

        it('should return a 204 status', (done) => {
          request.del(`${baseUrl}/origin/${testOrigin._id}`)
          .set({
            Authorization: `Bearer ${this.tempToken}`
          })
          .then((res) => {
            expect(res.status).to.equal(204);
            done();
          })
          .catch(done);
        });

        it('should return a 404 if no team is found', (done) => {
          request.del(`${baseUrl}/origin/fakeOrigin`)
          .set({
            Authorization: `Bearer ${this.tempToken}`
          })
          .catch((err) => {
            expect(err.response.status).to.equal(404);
            done();
          });
        });

        it('should return a 401 if no token is sent', (done) => {
          request.del(`${baseUrl}/origin/${testOrigin._id}`)
          .catch((err) => {
            expect(err.response.status).to.equal(401);
            done();
          });
        });
      });
    });

    describe('GET: /api/origin/search', () => {
      before((done) => {
        var testOrigin = {};
        debug('testOrigin:', testOrigin);
        debug('TOKEN: ', TOKEN);
        authController
        .signup({username:'namasdeuse3', password:'88881asds0000'})
        .then( (token) => {
          TOKEN = token;
        });
        return brewMethodController
        .createBrewMethod({
          title: 'ABC'
          , recipe: 'shity'
          , brewRatio: 1
          , brewTimer: 4
        })
        .then((brewMethod) => {
          return originController
         .createOrigin({
           country: 'Coolio',
           recMethod: brewMethod._id
         })
           .then((origin) => {
             testOrigin = origin;
             done();
           });
        });
      });
      after((done) => {
        Promise.all([
          userController.removeAllUsers(),
          originController.removeAllOrigins(),
          brewMethodController.removeAllBrewMethods()
        ])
        .then(() => done())
        .catch(done);
      });

      it('should return country + recMethod', (done) => {
        debug('~~~~~~~~~~~~search IT block', TOKEN);
        request.get(`${baseUrl}/origin/search?country=Coolio`)
        .set({
          Authorization: `Bearer ${TOKEN}`
        })
        .then((res) => {
          expect(res.status).to.equal(200);
          done();
        })
        .catch(done);
      });
      it('should return a 404 if no origin is found', (done) => {
        request.get(`${baseUrl}/origin/fakeOrigin`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .catch((err) => {
          expect(err.response.status).to.equal(404);
          expect(err.response.text).to.eql('NotFoundError');
          done();
        });
      });

      it('should return a 401 if no token is sent', (done) => {
        request.get(`${baseUrl}/origin/search?country=Coolio`)
        .then(done)
        .catch((err) => {
          expect(err.response.status).to.equal(401);
          expect(err.response.text).to.eql('UnauthorizedError');
          done();
        })
        .catch(done);
      });
    });

  });
});
// });
