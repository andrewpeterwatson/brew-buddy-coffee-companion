'use strict';

process.env.APP_SECRET = process.env.APP_SECRET || 'illnevertell';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/test';

const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const debug = require('debug')('brewbuddie:flavor-router-test');


const flavorController = require('../controller/flavor-controller');
const authController = require('../controller/auth-controller');
const userController = require('../controller/user-controller');

const port = process.env.PORT || 3000;
const baseURL = `localhost:${port}/api`;
const server = require('../server');

request.use(superPromise);



describe('testing module flavor-router', () => {
  before((done) => {
    debug('before module-auth');
    if(!server.isRunning) {
      server.listen(port, () => {
        debug(`server is up ::: ${port}`);
        done();
      });
      return;
    }
    done();
  });

  after((done) => {
    debug('after module flavor-router');
    if (server.isRunning) {
      server.close(() => {
        debug('server is down');
        done();
      });
      return;
    }
    done();
  });

  describe('testing module flavor-router', function() {

    after((done) => {
      debug('remove users');
      Promise.all ([
        userController.removeAllUsers()
        , flavorController.removeAllFlavor()
      ])
      .then(() => done())
      .catch(done);
    });

    before((done) => {
      debug('hitting module flavor test');
      authController.signup({username: 'dylan', password: 'davide'})
      .then(token =>  {
        this.tempToken = token;
        done();
        return;
      })
    .catch(done);
    });


    describe('testing POST api/flavor', () => {//
      debug('should return a flavor');
      it('should return a flavor', (done) => {
        request
        .post(`${baseURL}/flavor`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send({
          category: 'sugars'
          , flavorType: 'spicy'
          , title: 'cinnamon'
        })
        .then(res => {
          debug('hitting it block');
          expect(res.status).to.equal(200);
          expect(res.body.title).to.equal('cinnamon');
          done();
        })
        .catch(done);
      });
    });

    it('should return a 400 if no flavor is sent', (done) => {
      request
      .post(`${baseURL}/flavor`)
      .set({Authorization: `Bearer ${this.tempToken}`})
      .send({})
      .catch((err) => {
        expect(err.response.status).to.equal(400);
        done();
      });
    });
  });

  describe('testing GET api/flavor', function() {
    after((done) => {
      debug('remove users');
      Promise.all ([
        userController.removeAllUsers()
         , flavorController.removeAllFlavor()
      ])
       .then(() => done())
       .catch(done);
    });

    before((done) => {
      debug('hitting module flavor test');
      authController.signup({username: 'dylan', password: 'davide'})
     .then(token =>  this.tempToken = token)
     .then(() => flavorController.createFlavor({category: 'sugars', flavorType: 'cinnamon', title: 'lemon'}))
     .then((flavor) => this.tempFlavor = flavor)
     .then( () => done() )
     .catch(done);
    });

    it('should return a flavor', (done) => {
      request.get(`${baseURL}/flavor/${this.tempFlavor._id}`)
      .set({Authorization: `Bearer ${this.tempToken}`})
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.body.title).to.equal('lemon');
        done();
      })
       .catch(done);
    });
    it('should return not found', (done) => {
      request.get(`${baseURL}/flavor/fail/${this.tempFlavor._id}`)
      .set({Authorization: `Bearer ${this.tempToken}`})
      .auth('davide', '1234')
      .then(done)
      .catch(err => {
        const res = err.response;
        expect(res.status).to.equal(404);
        done();
      });
    });
  });


  describe('testing PUT api/flavor', function() {
    after((done) => {
      debug('remove users');
      Promise.all ([
        userController.removeAllUsers()
         , flavorController.removeAllFlavor()
      ])
       .then(() => done())
       .catch(done);
    });

    before((done) => {
      debug('hitting module flavor test');
      authController.signup({username: 'dylan', password: 'davide'})
     .then(token =>  this.tempToken = token)
     .then(() => flavorController.createFlavor({category: 'sugars', flavorType: 'cinnamon', title: 'lemon'}))
     .then((flavor) => this.tempFlavor = flavor)
     .then( () => done() )
     .catch(done);
    });

    it('should return return a flavor', (done) => {
      request.put(`${baseURL}/flavor/${this.tempFlavor._id}`)
      .set({Authorization: `Bearer ${this.tempToken}`})
      .send({category: 'Sugars', flavorType: 'cinnamon', title: 'lemon'})
      .then(res => {
        expect(res.status).to.equal(200);
        done();
      }).catch(done);

    });

    it('should return a 400 if no flavor is sent', (done) => {
      request.put(`${baseURL}/flavor/${this.tempFlavor._id}`)
      .set({Authorization: `Bearer ${this.tempToken}`})
      .catch((err) => {
        expect(err.response.status).to.equal(400);
        done();
      });
    });
  });

  describe('testing DELETE api/flavor', () => {
    after((done) => {
      debug('remove users');
      Promise.all ([
        userController.removeAllUsers()
         , flavorController.removeAllFlavor()
      ])
       .then(() => done())
       .catch(done);
    });

    before((done) => {
      debug('hitting module flavor test');
      authController.signup({username: 'dylan', password: 'davide'})
     .then(token =>  this.tempToken = token)
     .then(() => flavorController.createFlavor({category: 'Sugars', flavorType: 'cinnamon', title: 'lemon'}))
     .then((flavor) => this.tempFlavor = flavor)
     .then( () => done() )
     .catch(done);
    });

    it('should return a 204', (done) => {
      request.del(`${baseURL}/flavor/${this.tempFlavor._id}`)
      .set({Authorization: `Bearer ${this.tempToken}`})
      .then(res => {
        expect(res.status).to.equal(204);
        done();
      }).catch(done);
    });
  });
});
