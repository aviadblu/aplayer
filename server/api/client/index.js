var express = require('express');
var client_ctrl = require('./client.controller');
var router = express.Router();


router.get('/fetchAll', client_ctrl.triggerFetchClients);

module.exports = router;
