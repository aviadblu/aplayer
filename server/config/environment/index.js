'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
  if(!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

// add cli options
var cli_env = require('../cli');




// All configurations will extend these options
// ============================================
var all = {
  env: cli_env.env,

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: cli_env.port

};

var env_defaults = require('./' + cli_env.env + '.js');

var process_env = require('../process_env');

var config = _.merge(all, env_defaults, process_env, cli_env);

module.exports = config;
