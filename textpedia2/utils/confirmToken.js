/**
 * Module dependencies
 */
//=============================================================================
const sendNumber = require('./sendNumber');
var User = require('../models/users');
//=============================================================================
/**
 * Export Module
 */
//=============================================================================
module.exports = function (token, p_num, res) {
  User.findOne({phoneNumber: p_num}, function (err, user) {
    if(err) {
      console.log('There was a dB access error in retrieving the user');
      console.error(err);
      return res.status(500).json('User details unavailable');
    }
    const USR_TOKEN = user.temp_token.value;
    if(token == USR_TOKEN) {
      user.active = true;
      user.temp_token.value = '';
      return sendNumber(user.email, process.env.TWILIOLivePhoneNumber, res);
    }
    else {
      return res.status(403).json('There was a problem confirming the token. Retry in 2 hours.');
    }
  });
};
//=============================================================================
