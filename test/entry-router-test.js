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
    before((done) => {
      authController.signup({username: 'Justin', password: 'Kyle'})
      .then((token) => { this.tempToken = token })
      .then(() => done())
      .catch(done);
    });

    after((done) => {
      Promise.all([
        userController.removeAllUsers()
        ,entryController.removeAllEntries()
      ])
      .then(() => done())
      .catch(done);
    });

    //POST 200
    describe('testing POST on /api/entry', () => {
      it('should return a entry', (done) => {
        request
        .post(`${baseUrl}/entry`)
        .send({
          date: new Date()
          , aromas: ['feet', 'garbage', 'dirty diapers']
          , acidity: 'low'
          , body: 'bold'
          , finish: 'smooth'
          , experience: 'dopeness'
          , rating: 4
          // , userId: this.tempUser.id
          //, methodId: this.tempMethod.id
          //, originId: this.tempOrigin.id
          //, flavorId: this.tempFlavor.id
        })
        .set({Authorization: `Bearer ${this.tempToken}`})
        .then(res => {
          expect(res.status).to.equal(200);
          done();
        })
        .catch(done);
      });
    });

    //POST 400
    describe('testing POST on /api/entry with bad data', () => {
      it('should return a 400 bad request', (done) => {
        request
        .post(`${baseUrl}/entry`)
        .send({
          date: new Date()
          , aroas: ['feet', 'garbage', 'dirty diapers']
          , acidity: 'low'
          , body: 'bold'
          , finish: 'smooth'
          , experience: 'dopeness'
          , rating: 4
          // , userId: this.tempUser.id
          //, methodId: this.tempMethod.id
          //, originId: this.tempOrigin.id
          //, flavorId: this.tempFlavor.id
        })
        .set({Authorization: `Bearer ${this.tempToken}`})
        .then(done)
        .catch((err) => {
          try {
            var res = err.response;
            expect(res.status).to.equal(400);
            expect(res.text).to.equal('BadRequestError');
            done();
          } catch (err) {
            done(err);
          }
        });
      });
    });

    //POST 401 Unauthorized
    describe('testing POST on /api/entry for 401', () => {
      it('should return 401 unauthorized', (done) => {
        request
        .post(`${baseUrl}/entry`)
        .send({
          date: new Date()
          , aromas: ['feet', 'garbage', 'dirty diapers']
          , acidity: 'low'
          , body: 'bold'
          , finish: 'smooth'
          , experience: 'dopeness'
          , rating: 4
          // , userId: this.tempUser.id
          //, methodId: this.tempMethod.id
          //, originId: this.tempOrigin.id
          //, flavorId: this.tempFlavor.id
        })
        .then(done)
        .catch((err) => {
          try {
            var res = err.response;
            expect(res.status).to.equal(401);
            expect(res.text).to.equal('UnauthorizedError');
            done();
          } catch (err) {
            done(err);
          }
        });
      });
    });

    //GET 200
    describe('GET /api/entry/:id with valid id', function(){
      it('should return a entry', (done) => {
        request.get(`${baseUrl}/api/entry/${this.tempEntry.id}`)
        .then((res) => {
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(this.tempUser.name);
          done();
        })
        .catch(done);
      });
    });


  });
});
