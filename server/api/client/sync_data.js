var config = require('../../config/environment/index');
var app = config.app;

var io = app.io;

var emitor = {
  emit: function (uid, data) {
    io.emit(uid, data);
  }
};

module.exports = emitor;
