var express = require('express');
var youtube = require('./youtube.controller');
var router = express.Router();

router.get('/search', youtube.search);
router.get('/loadExtraData', youtube.loadExtraData);




module.exports = router;
