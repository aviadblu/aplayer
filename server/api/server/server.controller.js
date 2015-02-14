var config = require('../../config/environment');
var path = require('path');
var serverServices = require("./services");

var server_ctrl = {
  create: function (req, res) {
    var accessToken = req.get('x-access-token');
    if (!accessToken) {
      return res.status(400).send("Please log in!");
    }

    serverServices.createServer(accessToken, req.body, function (err, data) {
      res.send(data)
    });
  },
  getData: function(req, res) {
    serverServices.getServer(req.query, function (data) {
      if(data)
        res.send(data)
      else
        res.status(400).send("server not found!");
    });
  },
  update: function(req, res) {
    var accessToken = req.get('x-access-token');
    if (!accessToken) {
      return res.status(400).send("Please log in!");
    }
    serverServices.updateServer(accessToken, req.body, function (data) {
        res.send(data)
    });
  }
};

module.exports = server_ctrl;
