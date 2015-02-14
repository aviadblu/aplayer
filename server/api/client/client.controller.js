var config = require('../../config/environment');
var path = require('path');
var clientServices = require("./services");

var client_ctrl = {
  fetchClients: function () {
    clientServices.listenAllClients();
  },
  triggerFetchClients: function(req, res) {
    res.send({status:"ok"});
    clientServices.listenAllClients();
  }
};

module.exports = client_ctrl;
