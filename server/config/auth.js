var config = require('./environment');


module.exports = {

  'facebookAuth' : {
    'clientID'      : '328004634063256', // your App ID
    'clientSecret'  : '8f52cdba77c2bd0b8c1ec8c3d44eb2e4', // your App Secret
    'callbackURL'   : config.facebookAuth.callbackURL
  },

  'twitterAuth' : {
    'consumerKey'       : 'your-consumer-key-here',
    'consumerSecret'    : 'your-client-secret-here',
    'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
  },

  'googleAuth' : {
    'clientID'      : 'your-secret-clientID-here',
    'clientSecret'  : 'your-client-secret-here',
    'callbackURL'   : 'http://localhost:8080/auth/google/callback'
  }

};
