var express = require('express');
var accounts = require('../api/accounts/accounts.controller');
var router = express.Router();
var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;

router.get('/', function(req, res, next){
  passport.authenticate('facebook', {scope: 'email'})(req, res, next);
});

router.get('/callback', function(req, res, next){
  passport.authenticate('facebook', function(err, user, info){
    if (err) { return next(err); }
    if (!user) {
      return res.redirect('/');
    }

    res.redirect("/#auth/" + user.id);
  })(req, res, next);
});

module.exports = router;
