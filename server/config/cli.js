var cli = require("cli");

cli.parse({
	port   : ['p', 'Port','number'],
	env    : ['e', 'Environment (staging | development | production)', 'string', -1],
	mini   : ['m', 'Client is minified (if set -m client is not minified)'],
	debug  : ['s', 'Print to console and stop on error']
});

var cli_env;

cli.main(function(args, options) {

  cli_env = {};


  if(options.env != -1) {
    cli_env.env = options.env;
  }

	if(options.port)
		cli_env.port = options.port;

	if(options.api_url)
		cli_env.orion = {
			url : options.api_url
		};

	if(options.docker)
		cli_env.docker = {
			ip: options.docker
		};

	if(options.mini)
		cli_env.client_minified = '0';

	if(options.debug)
		cli_env.debug = true;


});

module.exports = cli_env;
