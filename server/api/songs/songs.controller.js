var config = require('../../config/environment');
var walk    = require('walk');
var path = require('path');
var sync_data = require('./../client/sync_data');

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

    },

    update_state: function(req, res) {
      var uid = req.body.uid;
      console.log(uid + ": update state");

      sync_data.emit(uid + "_client",{
        tracks: req.body.tracks,
        trackIndex: req.body.trackIndex
      });

      return res.send({status:"ok"});
    },

    pick: function(req, res) {
      var uid = req.body.uid;
      console.log(uid + " client: pick song " + req.body.song.name);

      sync_data.emit(uid, {
        song: req.body.song
      });

      return res.send({status:"ok"});
    }
};

module.exports = songs;
