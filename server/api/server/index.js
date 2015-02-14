var express = require('express');
var server_ctrl = require('./server.controller');
var router = express.Router();

router.post('/create', server_ctrl.create);
router.get('/get-data', server_ctrl.getData);
router.post('/update', server_ctrl.update);



module.exports = router;
