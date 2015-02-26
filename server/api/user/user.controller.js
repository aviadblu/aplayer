var config = require('../../config/environment');
var path = require('path');
var userServices = require('./services');





// youtube oauth public pass: notasecret

var userCtrl = {

  addPlaylist: function(req, res) {
    var accessToken = req.get('x-access-token');
    if (!accessToken) {
      return res.status(400).send("Please log in!");
    }
    userServices.addPlaylist(accessToken, req.body, function (data) {
      res.send({status: "ok"});
    });
  },

  loadPlaylist: function(req, res) {
    var accessToken = req.get('x-access-token');
    if (!accessToken) {
      return res.status(400).send("Please log in!");
    }

    userServices.loadPlaylist(accessToken, function (data) {
      if(data) {
        res.send(data);
      }
      else {
        res.send([]);
      }

    });
  },

  delPlaylist: function(req, res) {
    var accessToken = req.get('x-access-token');
    if (!accessToken) {
      return res.status(400).send("Please log in!");
    }

    userServices.delPlaylist(accessToken, req.body.id, function () {
        res.send({"status":"ok"});
    });
  }


};

module.exports = userCtrl;
