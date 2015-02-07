var express = require('express');
var songs = require('./songs.controller');
var router = express.Router();

router.get('/list', songs.list);
router.post('/update_state', songs.update_state);
router.post('/pick', songs.pick);




module.exports = router;
