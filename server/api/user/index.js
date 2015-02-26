var express = require('express');
var userCtrl = require('./user.controller');
var router = express.Router();

router.post('/addPlaylist', userCtrl.addPlaylist);
router.get('/loadPlaylist', userCtrl.loadPlaylist);
router.post('/delPlaylist', userCtrl.delPlaylist);


module.exports = router;
