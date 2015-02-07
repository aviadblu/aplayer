
var process_env = {};

if(process.env.NODE_ENV)
    process_env.env = process.env.NODE_ENV;

if(process.env.PORT)
    process_env.port = process.env.PORT;

if(process.env.API_URL)
    process_env.orion = {
        url : process.env.API_URL
    };

if(process.env.DOCKER_IP)
    process_env.docker = {
        url: process.env.DOCKER_IP
    };

if(process.env.CLIENT_MINI)
    process_env.bundles = bundles_selector(process.env.CLIENT_MINI);

module.exports = process_env;