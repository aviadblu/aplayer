/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');
var config = require('./config/environment');



var allowCrossDomain = function (req, res, next) {
	//console.log("allow CRPSS Domain");
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Orion-Version, X-Requested-With');
	next();
};


module.exports = function (app) {
	// Insert routes below
	app.use(allowCrossDomain);


	app.use('/api/accounts', require('./api/accounts'));
  app.use('/api/songs', require('./api/songs'));
	// All other routes should redirect to the index.html
	app.route('/*')
		.get(function (req, res) {
			res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
		});
};
