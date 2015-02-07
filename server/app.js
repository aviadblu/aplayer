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

// Setup server
var app = express();
var server = require('http').createServer(app);





require('./config/express')(app);
require('./routes')(app);
config.app = app;


// Start server



if (!module.parent) {
  mserver.listen(config.port, function () {
    console.log('Express server listening on %d, in %s mode, client is%s minified', config.port, app.get('env'), (config.client_minified == "1" ? "" : " not"));
  });
} else {
  module.exports = app;
}

// Expose app
exports = module.exports = app;
