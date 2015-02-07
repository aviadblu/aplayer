var config = require('../../config/environment');
var walk    = require('walk');
var path = require('path');

var songs = {
  list: function(req, res) {
        var supported_ext = ["mp3"];

        var files   = [];

        var client_dir = req.query.d;

        var dir = path.resolve(config.app.get('appPath') + "/" + client_dir);
        // Walker options
        var walker  = walk.walk(dir, { followLinks: false });

        walker.on('file', function(root, stat, next) {
          // Add this file to the list of files
          var splitName = stat.name.split(".");
          var ext = splitName[splitName.length-1];

          if(supported_ext.indexOf(ext) > -1) {
            files.push({
              name: stat.name,
              path: client_dir + '/' + stat.name
            });
          }

          next();
        });

        walker.on('end', function() {
          console.log("~~~~~~dir files: ~~~~");
          console.log(files);
          console.log("~~~~~~~~~~~~~~~~~~~~~");
          return res.send(files);
        });

    }
};

module.exports = songs;
