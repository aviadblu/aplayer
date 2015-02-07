var express = require('express');
var songs = require('./songs.controller');
var router = express.Router();

router.get('/list', songs.list);


module.exports = router;
