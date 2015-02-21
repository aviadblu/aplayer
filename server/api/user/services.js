var db = require('../../config/firebase/connection');
var accounts_db = db.child('accounts');
var uuid = require('node-uuid');

var userServices = {

  addPlaylist: function(accessToken, playlist , callback) {
    var user = accounts_db.child(accessToken);
    user.once("value", function(data) {
      var data = data.val();
      if (!data) {
        callback(null)
      }
      user.child("playlists").push(playlist,function(data){
        callback(data);
      });

    });
  },

  loadPlaylist: function(accessToken , callback) {
    var playlists = accounts_db.child(accessToken).child("playlists");
    playlists.once("value", function(data) {
      var data = data.val();
      if (!data) {
        callback(null)
      }
      callback(data);
    });
  },

  updateSongData: function(accessToken, song_id, updated_data, callback) {
    var playlists = accounts_db.child(accessToken).child("playlists");
    playlists.once("value", function(data) {
      var data = data.val();
      if (!data) {
        callback(null)
      }



      for(var playlist_id in data) {

        for(var k in data[playlist_id].songs) {
            if(data[playlist_id].songs[k].id == song_id) {
              console.log("update " + data[playlist_id].songs[k].id);
              playlists.child(playlist_id).child("songs").child(k).update(updated_data, function () {

              });

            }
        }
      }
      callback();
    });
  }
};


module.exports = userServices;
