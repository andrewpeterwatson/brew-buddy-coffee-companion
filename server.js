 'use strict';

 const express = require('express');
 const morgan = require('morgan');
 const cors = require('cors');
 const mongoose = require('mongoose');
 const httpErrors = require('http-errors');
 const debug = require('debug')('brewbuddie:server');

 const handleError = require('./lib/app-error');
 const parserBearerAuth = require('./lib/parse-bearer-auth');
 const authRouter = require('./routes/auth-route');

 const originRouter = require('./routes/origin-router');
 const brewMethodRouter = require('./routes/brew-method-routes');
 const entryRouter = require('./routes/entry-route');
 const flavorRouter = require('./routes/flavor-route');
 const brewBoardRouter = require('./routes/brew-board-route');

 const app = express();
 const port = process.env.PORT || 3000;
 const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/authdev';

 console.log(process.env.npm_config_dev_url);
 console.log(process.env.npm_config_app_secret);

 process.env.APP_SECRET = process.env.APP_SECRET || process.env.npm_config_app_secret;

 mongoose.connect(mongoURI);
 console.log('process.env.APP_SECRET: ', process.env.APP_SECRET);
 app.use(morgan('dev'));
 app.use(cors());

 app.all('/', parserBearerAuth, function(req, res){
   res.send('a Cup of Coffee!');
 });


 app.use('/api', authRouter);
 app.use('/api', entryRouter);
 app.use('/api', flavorRouter);
 app.use('/api', originRouter);
 app.use('/api', brewMethodRouter);
 app.use('/api', brewBoardRouter);

 app.all('*', function(req, res, next){
   debug('404 * route');
   next(httpErrors(404, 'Not Found'));
 });

 app.use(handleError);

// start server
 const server = app.listen(port, function(){
   debug('server up <o)))><|', port);
 });

 server.isRunning = true;
 module.exports = server;
