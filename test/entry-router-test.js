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

            category: 'Sugars'
            , flavorType: 'chocaltey'
            , title: 'the dope flavor'
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

    //POST 200
    describe('testing POST on /api/entry', () => {
      it('should return a entry', (done) => {
        request.post(`${baseUrl}/entry`)
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
      .set({Authorization: `Bearer ${this.tempToken}`})
      .then(res => {
        expect(res.status).to.equal(200);
        done();
      })
      .catch(done);
      });
    });

    describe('testing POST on /api/entry with bad data', () => {
      it('should return a 400 bad request', (done) => {
        request.post(`${baseUrl}/entry`)
      .send({
        date: new Date()
        , aroas: ['feet', 'garbage', 'dirty diapers']
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
        , username: 'Kyle'
        , methodId: this.tempBrewMethod
        , originId: this.tempOrigin
        , flavorId: this.tempFlavor
        , privacy: false
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

    describe('GET /api/entry', () => {
      it('should return a entry', (done) => {
        request.get(`${baseUrl}/entry/${this.tempEntry}`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.acidity).to.equal('low');
        done();
      })
      .catch(done);
      });

      it('should return a 404 if no entry is found', (done) => {
        request.get(`${baseUrl}/entry/fakestuff`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .catch((err) => {
        expect(err.response.status).to.equal(404);
        done();
      });
      });

      it('should return a 401 if no token is sent', (done) => {
        request.get(`${baseUrl}/entry/${this.tempEntry}`)
      .catch((err) => {
        expect(err.response.status).to.equal(401);
        done();
      });
      });
    });

//Get all
    describe('GET /api/entry/all', () => {
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
            , privacy: false
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
        request.get(`${baseUrl}/entry/Kyle`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .then((res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.equal(3);
          done();
        })
        .catch(done);
      });
    });

    describe('PUT /api/entry/:id', () => {
      before((done) => {
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
        , privacy: false
        })
      .then((entry) => {
        this.testEntry = entry;
        done();
      });
      });

      it('should return the modified entry', (done) => {
        request.put(`${baseUrl}/entry/${this.tempEntry}`)
      .send({
        date: new Date()
        , aromas: ['Flowers', 'Nice Stuff', 'Summer Rain']
        , acidity: 'high'
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
      })
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.acidity).to.equal('high');
        done();
      }).catch(done);
      });

      it('should return 401 if no token is provided', (done) => {
        request.put(`${baseUrl}/entry/${this.username}`)
      .send({
        date: new Date()
        , aromas: ['Flowers', 'Nice Stuff', 'Summer Rain']
        , acidity: 'high'
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
      .catch((err) => {
        expect(err.response.status).to.equal(401);
        done();
      });
      });

      it('should return 400 if no entry is sent', (done) => {
        request.put(`${baseUrl}/entry/${this.username}`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .catch((err) => {
        expect(err.response.status).to.equal(400);
        done();
      });
      });

      it('should return 404 if no entry is found', (done) => {
        request.put(`${baseUrl}/entry/fakeEntry`)
      .send({
        date: new Date()
        , aromas: ['Flowers', 'Nice Stuff', 'Summer Rain']
        , acidity: 'high'
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
      })
      .catch((err) => {
        expect(err.response.status).to.equal(404);
        done();
      });
      });
    });

    describe('DELETE /api/entry/:id', () => {
      before((done) => {
        entryController.createEntry({
          date: new Date()
        , aromas: ['Flowers', 'Nice Stuff', 'Summer Rain']
        , acidity: 'high'
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
      .then((entry) => {
        this.testEntry = entry;
        done();
      });
      });

      it('should return a 204 status', (done) => {
        request.del(`${baseUrl}/entry/${this.tempEntry}`)
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
        request.del(`${baseUrl}/entry/fakeEntry`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .catch((err) => {
        expect(err.response.status).to.equal(404);
        done();
      });
      });

      it('should return a 401 if no token is sent', (done) => {
        request.del(`${baseUrl}/entry/${this.tempEntry}`)
      .catch((err) => {
        expect(err.response.status).to.equal(401);
        done();
      });
      });
    });

    describe('GET /api/entry/search', () => {
      it('should return a result', (done) => {
        debug('searching entries');
        request.get(`${baseUrl}/entry/search?body=bold`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .then((res) => {
          expect(res.status).to.equal(200);
          done();
        })
        .catch(done);
      });

      it('should return a 204 if nothing is found', (done) => {
        debug('testing for 204 search');
        request.get(`${baseUrl}/entry/search?body=fuckoff`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .then((res) => {
          expect(res.status).to.equal(204);
          done();
        })
        .catch(done);
      });
    });
  });
});
