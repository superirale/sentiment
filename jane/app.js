'use strict';
/**
 * Import Module Dependencies
 */
//=============================================================================
const
  express = require('express'),
  logger = require('morgan'),
  bParser = require('body-parser'),
  compression = require('compression'),
  path = require('path'),
  cors = require('cors');
//=============================================================================
/**
 * Create Express App
 */
//=============================================================================
const app = express();
//=============================================================================
/**
 * Module variables
 */
//=============================================================================
const
  port = process.env.PORT || 3030,
  env = process.env.NODE_ENV,
  routes = require('./routes/routes');
//=============================================================================
/**
 * App config and settings
 */
//=============================================================================
require('clarify');
app.disable('x-powered-by');
app.set('port', port);
app.set('env', env);
//=============================================================================
/**
 * Middleware Stack
 */
//=============================================================================
app.use(cors());
app.use(logger('dev'));
app.use(bParser.json());
app.use(bParser.urlencoded({extended: true}));
app.use(compression());
app.use(express.static(`${__dirname}/ui-react/build`));
//=============================================================================
/**
 * Routes
 */
//=============================================================================
app.get('/test', function (req, res) {
  return res.status(200)
    .send('<marquee><h1>Yaaaay... it works!!!</h1></marquee>');
});
app.use('/', routes);
//=============================================================================
/**
 * Custom Error Handler
 */
//=============================================================================
app.use(function (err, req, res, next) {
  console.error(err.stack);
  return res.status(500).json('An error occured');
});
//=============================================================================
/**
 * Export Module
 */
//=============================================================================
module.exports = app;
//=============================================================================
