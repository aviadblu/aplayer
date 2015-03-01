var express = require('express');
var fb_ctrl = require('./facebook.controller');
var router = express.Router();


router.get('/friends', fb_ctrl.getFriendsList);

module.exports = router;
