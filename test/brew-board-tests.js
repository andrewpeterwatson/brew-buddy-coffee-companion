'use strict';

process.env.APP_SECRET = process.env.APP_SECRET || 'justinAndKyleRock';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/test';

//require npm modules
const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const debug = require('debug')('brewBuddy: entry-router-test');

//app modules
const userController = require('../controller/user-controller');
const entryController = require('../controller/entry-controller');
const authController = require('../controller/auth-controller');
const originController = require('../controller/origin-controller');
const brewMethodController = require('../controller/brew-method-controller');
const flavorController = require('../controller/flavor-controller');

//module constants
const port = process.env.PORT || 3000;
const baseUrl = `localhost:${port}/api`;
const server = require('../server');
request.use(superPromise);

let TOKEN;
let BUDDYTOKEN;

function createBuddy(){
  var brewMethodId;
  var originId;
  var flavorId;
  return new Promise((resolve, reject) => {
    authController.signup({username: 'kyle', password: '1234'})
    .then( (token) => {
      BUDDYTOKEN = token;
      console.log(BUDDYTOKEN);
      return brewMethodController.createBrewMethod({
        title: 'The Title'
        , recipe: ['goodStuff', 'badStuff']
        , brewRatio: 3
        , brewTimer: 4
      });
    })
    .then( (brewMethod) => {
      brewMethodId = brewMethod._id;
      return originController.createOrigin({
        country: 'Spokanistan'
        ,recMethod: brewMethodId
      });

    })
    .then( (origin) => {
      originId = origin._id;
      return flavorController.createFlavor({
        category: 'Bold'
        , flavorType: 'Sweet'
        , title: 'the sweet and the bold'
      });
    })
    .then( (flavor) => {
      flavorId = flavor._id;
      entryController.createEntry({
        date: new Date()
        , aromas: ['lemon zest', 'orange zest', 'baby powder']
        , acidity: 'it burns'
        , body: 'bold'
        , finish: 'smooth AF'
        , experience: 'dopeness'
        , rating: 4
        , username: 'kyle'
        , methodId: brewMethodId
        , originId: originId
        , flavorId: flavorId
        , privacy: false
      })
      .then(entry => resolve(entry));
    })
    .catch(reject);
  });
}

function createEntry(){
  var brewMethodId;
  var originId;
  var flavorId;
  return new Promise((resolve, reject) => {
    authController.signup({username: 'sluggys', password: '1234', buddies: ['kyle']})
    .then( (token) => {
      TOKEN = token;
      return brewMethodController.createBrewMethod({
        title: 'The Title'
        , recipe: ['goodStuff', 'badStuff']
        , brewRatio: 3
        , brewTimer: 4
      });
    })
    .then( (brewMethod) => {
      brewMethodId = brewMethod._id;
      return originController.createOrigin({
        country: 'Spokanistan'
        ,recMethod: brewMethodId
      });

    })
    .then( (origin) => {
      originId = origin._id;
      return flavorController.createFlavor({
        category: 'Bold'
        , flavorType: 'Sweet'
        , title: 'the sweet and the bold'
      });
    })
    .then( (flavor) => {
      flavorId = flavor._id;
      entryController.createEntry({
        date: new Date()
        , aromas: ['feet', 'garbage', 'dirty diapers']
        , acidity: 'low'
        , body: 'bold'
        , finish: 'smooth'
        , experience: 'dopeness'
        , rating: 4
        , username: 'sluggys'
        , methodId: brewMethodId
        , originId: originId
        , flavorId: flavorId
        , privacy: false
      })
      .then(entry => resolve(entry));
    })
    .catch(reject);
  });
}

describe('testing brewBoard-route', function() {
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

//Testing GET on Brew Board
  describe('GET /api/brewBoard', () => {
    before((done) => {
      console.log('hit first');
      createBuddy()
      .then( entry => {
        this.entry = entry;
        done();
      })
      .catch( (err)=> console.error(err));
    });

    after((done) => {
      Promise.all([
        userController.removeAllUsers()
      , entryController.removeAllEntries()
      , originController.removeAllOrigins()
      , brewMethodController.removeAllBrewMethods()
      , flavorController.removeAllFlavor()
      ])
    .then(() => done())
    .catch(done);
    });

    it('should return an array of entries for the Brew Board', (done) => {
      createEntry()
      .then(entry => {
        this.entry = entry;
        request.get(`${baseUrl}/brewBoard`)
        .set({
          Authorization: `Bearer ${TOKEN}`
        })
        .then((res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.equal(1);
          expect(res.body[0].finish).to.equal('smooth AF');
          expect(res.body[0].username).to.equal('kyle');
          done();
        })
        .catch(done);
      });
    });
  });

  describe('GET /api/brewBoard NOT FOUND', () => {

    after((done) => {
      Promise.all([
        userController.removeAllUsers()
      , entryController.removeAllEntries()
      , originController.removeAllOrigins()
      , brewMethodController.removeAllBrewMethods()
      , flavorController.removeAllFlavor()
      ])
    .then(() => done())
    .catch(done);
    });

    it('should return NOT FOUND for the Brew Board', (done) => {
      createEntry()
      .then(entry => {
        this.entry = entry;
        request.get(`${baseUrl}/brewBoard/k;jlkbh`)
        .set({
          Authorization: `Bearer ${TOKEN}`
        })
        .then(done)
        .catch((err) => {
          expect(err.response.status).to.equal(404);
          done();
        });
      });
    });
  });

  describe('GET /api/brewBoard UnAuthorized', () => {

    after((done) => {
      Promise.all([
        userController.removeAllUsers()
      , entryController.removeAllEntries()
      , originController.removeAllOrigins()
      , brewMethodController.removeAllBrewMethods()
      , flavorController.removeAllFlavor()
      ])
    .then(() => done())
    .catch(done);
    });

    it('should return NOT FOUND for the Brew Board', (done) => {
      createEntry()
      .then(entry => {
        this.entry = entry;
        request.get(`${baseUrl}/brewBoard`)
        .then(done)
        .catch((err) => {
          expect(err.response.status).to.equal(401);
          done();
        });
      });
    });
  });




});
