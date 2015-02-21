'use strict';

var path = require('path');


// Development specific configuration
// ==================================
module.exports = {

	port: 4000,

	client_minified: '0',

  facebookAuth: {
    callbackURL: "http://www.jukebox-player.info/auth/facebook/callback"
  }

};
