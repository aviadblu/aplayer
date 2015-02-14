var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;
var accounts = require('../api/accounts/accounts.controller');
var uuid = require('node-uuid');

var configAuth = require('../config/auth');

passport.use(new FacebookStrategy({
    clientID        : configAuth.facebookAuth.clientID,
    clientSecret    : configAuth.facebookAuth.clientSecret,
    callbackURL     : configAuth.facebookAuth.callbackURL
  },
  function (accessToken, refreshToken, profile, done) {
    var id =uuid.v1();
    var user_data = {
      id: id,
      display_name: profile.displayName,
      lname: profile.name.givenName || "",
      fname: profile.name.familyName || "",
      email: profile.emails[0].value,
      photo: "http://graph.facebook.com/" + profile.id + "/picture?type=square",
      gender: profile.gender,
      facebook_id: profile.id,
      facebookAccessToken: accessToken
    };

    accounts.updateUser(user_data,function(user){
      done(null, user);
    });



  }
));
