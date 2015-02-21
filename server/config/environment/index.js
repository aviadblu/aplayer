'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
  if(!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

var cli_env = require('../cli');
var process_env = require('../process_env');

var external_env = _.merge(process_env, cli_env);

// All configurations will extend these options
// ============================================
var all = {
  env: external_env.env || "production",

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: cli_env.port

};

var env_defaults = require('./' + all.env + '.js');

var config = _.merge(all, env_defaults, external_env);

module.exports = config;
