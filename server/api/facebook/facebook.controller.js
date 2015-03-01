var config = require('../../config/environment');
var path = require('path');
var graph = require('fbgraph');
var configAuth = require('../../config/auth');
var userServices = require('../user/services');

var fb_ctrl = {
  getFriendsList: function (req, res) {
    var accessToken = req.get('x-access-token');
    if (!accessToken) {
      return res.status(400).send("Please log in!");
    }
    
    userServices.getUser(accessToken, function(user_data){

      var userFacebookAccessToken = user_data.facebookAccessToken;
      graph.setAccessToken(userFacebookAccessToken);

      graph.get("/" + user_data.facebook_id + '/friends', function(err, fb_res) {
        if(err) {
          return res.status(400).send(err);
        }
        res.send(fb_res.data);
      });
    });

  }
};

module.exports = fb_ctrl;
