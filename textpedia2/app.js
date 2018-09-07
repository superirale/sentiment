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
  config = require('./config/config'),
  mongoose = require('mongoose'),
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
  env = config.env,
  routes = require('./routes/routes');
var
  db,
  dBURL;
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
 * dBase connection
 */
//=============================================================================
dBURL = process.env.dBURL;

mongoose.connect(dBURL);
db = mongoose.connection;
db.on('error', function (err) {
  console.error('There was a db connection error');
  return  console.error(err.message);
});
db.once('connected', function () {
  return console.log('Successfully connected to ' + dBURL);
});
db.once('disconnected', function () {
  return console.error('Successfully disconnected from ' + dBURL);
});
process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.error('dBase connection closed due to app termination');
    return process.exit(0);
  });
});
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
//=============================================================================
/**
 * Routes
 */
//=============================================================================
app.get('/test', function (req, res) {
  return res.status(200).
    send('<marquee><h1>Yaaaay... it works!!!</h1></marquee>');
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
