'use strict';

process.env.APP_SECRET = process.env.APP_SECRET || 'justinAndKyleRock';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/test';

//require npm modules
const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const debug = require('debug')('brewBuddy: entry-router-test');

//app modules
const entryController = require('../controller/entry-controller');
const authController = require('../controller/auth-controller');
const userController = require('../controller/user-controller');
const originController = require('../controller/origin-controller');
const brewMethodController = require('../controller/brew-method-controller');
const brewBoardController = require('../controller/brew-board-controller');

//module constants
const port = process.env.PORT || 3000;
const baseUrl = `localhost:${port}/api`;
const server = require('../server');
request.use(superPromise);

describe('testing entry-routes', function() {
  before((done) => {
    debug('before entry-routes');
    if(!server.isRunning) {
      server.listen(port, () => {
        server.isRunning = true;
        debug('server is up ::', `${port}`);
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
        debug('server is down');
        done();
      });
      return;
    }
    done();
  });

  describe('testing module entry-router', function() {
    beforeEach((done) => {
      authController.signup({username: 'Kyle', password:'Justin'})
      .then(token => {
        this.tempToken = token;
        return token;
      })
        .then((token) => {
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
          return request.post(`${baseUrl}/origin`)
          .send({
            country: 'Spokanistan'
            ,recMethod: this.tempBrewMethod._id
          })
          .set({
            Authorization: `Bearer ${this.tempToken}`
          });
        })
        .then(res => {
          this.tempOrigin = res.body._id;
        })
        .then( () => {
          return request.post(`${baseUrl}/flavor`)
          .send({
            flavorType: 'chocaltey'
            , title: 'the dope flavor'
            , adjective: ['fast', 'slow']
          })
          .set({
            Authorization: `Bearer ${this.tempToken}`
          });
        })
        .then(res => {
          this.tempFlavor = res.body._id;
        })
        .then( () => {
          return request.post(`${baseUrl}/entry`)
          .send({
            date: new Date()
            , aromas: ['feet', 'garbage', 'dirty diapers']
            , acidity: 'low'
            , body: 'bold'
            , finish: 'smooth'
            , experience: 'dopeness'
            , rating: 4
            , username: 'Kyle'
            , methodId: this.tempBrewMethod
            , originId: this.tempOrigin
            , flavorId: this.tempFlavor
            , privacy: false
          })
          .set({
            Authorization: `Bearer ${this.tempToken}`
          });
        })
        .then(res => {
          this.tempEntry = res.body._id;
          done();
        })
        .catch(done);
    });

    afterEach((done) => {
      Promise.all([
        userController.removeAllUsers()
      , entryController.removeAllEntries()
      , originController.removeAllOrigins()
      , brewMethodController.removeAllBrewMethods()
      ])
    .then(() => done())
    .catch(done);
    });
  });

  //Testing GET on Brew Board
  describe('GET /api/entry/brewBoard', () => {
    before((done) => {
      Promise.all([
        entryController.createEntry({
          date: new Date()
          , aromas: ['feet', 'garbage', 'dirty diapers']
          , acidity: 'low'
          , body: 'bold'
          , finish: 'smooth'
          , experience: 'dopeness'
          , rating: 4
          , username: 'Kyle'
          , methodId: this.tempBrewMethod
          , originId: this.tempOrigin
          , flavorId: this.tempFlavor
          , privacy: true
        }),
        entryController.createEntry({
          date: new Date()
          , aromas: ['sugar', 'roses', 'bacon']
          , acidity: 'low'
          , body: 'bold'
          , finish: 'smooth'
          , experience: 'dopeness'
          , rating: 4
          , username: 'Kyle'
          , methodId: this.tempBrewMethod
          , originId: this.tempOrigin
          , flavorId: this.tempFlavor
          , privacy: false
        })
      ])
      .then(() => done())
      .catch(done);
    });

    it('should return an array of entries', (done) => {
      request.get(`${baseUrl}/entry/brewBoard`)
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


});
