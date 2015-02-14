/**
 * Main application file
 */

'use strict';

// set root directory path as global:
var path = require('path');
//var api = require('cf-api-lib');
global.appRoot = path.resolve(__dirname);

// add cli options
require('./config/cli');

var express = require('express');
var config = require('./config/environment');



if(config.debug) {
	console.log("+++++++++++++++~~~~~~~~~ config ~~~~~~~~~~+++++++++++++++++");
	console.log(config);
	console.log("+++++++++++++++~~~~~~~~~~~~~~~~~~~~~~~~~~~+++++++++++++++++");
}
else {
	process.on('uncaughtException', console.error.bind(console));
}

var appSocket = require('./lib/node_app_socket');
var appContext = require('./lib/node_apps').AppContext;

// Setup server
var app = express();
var server = require('http').createServer(app);

config.app = app;


require('./facebook_auth');


var io = require('socket.io')(server);
app.io = io;

appSocket.install({ io: io, appContext: appContext });

require('./config/express')(app);
require('./routes')(app);

// open clients listener:
var client_ctrl = require('./api/client/client.controller');
client_ctrl.fetchClients();
/////////////////////////

// Start server



if (!module.parent) {
  server.listen(config.port, function () {
    console.log('Express server listening on %d, in %s mode, client is%s minified', config.port, app.get('env'), (config.client_minified == "1" ? "" : " not"));
  });
} else {
  module.exports = app;
}

// Expose app
var exports = module.exports = app;
