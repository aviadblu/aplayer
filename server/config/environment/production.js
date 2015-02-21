'use strict';

var path = require('path');


// Development specific configuration
// ==================================
module.exports = {

  port: 80,

  client_minified: '1',

  facebookAuth: {
    callbackURL: "http://www.jukebox-player.com/auth/facebook/callback"
  }

};
