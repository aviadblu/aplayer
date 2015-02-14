var express = require('express');
var accounts = require('./accounts.controller');
var router = express.Router();

router.get('/identity', accounts.identity);


module.exports = router;
