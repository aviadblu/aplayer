var db = require('../../config/firebase/connection');
var accounts_db = db.child('accounts');
var uuid = require('node-uuid');

var serverServices = {
  createServer: function(accessToken, server_data, callback){

    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    var user = accounts_db.child(accessToken);
    user.once("value", function(data) {
      var data = data.val();
      if(data) {

        var new_server = {
          id: uuid.v1(),
          rand_no: getRandomInt(1,20),
          created: new Date().getTime(),
          "private": server_data.private,
          name: server_data.name,
          active: 0,
          tracks: []
        };

        user.child("servers").push(new_server);
        callback(null, new_server);
      }
      else {
        callback("No such id!");
      }

    });
  },

  deleteServer: function(accessToken, server_id, callback) {
    var servers = accounts_db.child(accessToken).child("servers");

    servers.once("value", function (data) {
      var data = data.val();
      if (!data) {
        callback("No data");
        return;
      }

      var serverToRemove = null;

      for(var server_k in data) {

        if(data[server_k].id == server_id) {
          serverToRemove = server_k;
        }
      }

      if(serverToRemove) {
        servers.child(serverToRemove).remove(function(){
          callback(null, "ok");
        });
      }
      else {
        callback("No server");
      }

    });

  },

  getAll: function(accessToken, callback){
    var servers = accounts_db.child(accessToken).child("servers");
    servers.once("value", function (data) {
      var data = data.val();
      if (!data) {
        callback();
        return;
      }

      callback(data);

    });
  },


  getServer : function(request, callback) {
    var server_id_needed = request.server_id;
    var server_data;
    accounts_db.once("value", function (data) {
      var data = data.val();
      if (!data) {
        callback(null);
        return;
      }

      for (var u in data) {
        for (s in data[u].servers) {
          var server_Id = data[u].servers[s].id;

          if (server_id_needed == server_Id) {
            server_data = {
              id: server_Id,
              name: data[u].servers[s].name,
              rand_no: data[u].servers[s].rand_no,
              "private": data[u].servers[s].private,
              active: data[u].servers[s].active,
              user: {
                name: data[u].display_name,
                photo: data[u].photo
              },
              tracks: data[u].servers[s].tracks
            };
            return callback(server_data);
          }

        }
      }

      callback(null)
    });


  },

  updateServer: function(accessToken, request, callback) {
    var server_id = request.server_id;
    var new_data = request.server_data;


    var user = accounts_db.child(accessToken);
    user.once("value", function(data) {
      var data = data.val();
      if (!data) {
        callback(null)
      }

      var servers_db = user.child("servers");
      servers_db.once("value", function(data) {
        var servers = data.val();
        if (!servers) {
          callback(null);
          return;
        }

        for(var s in servers) {
          if(servers[s].id == server_id) {
            servers_db.child(s).update(new_data, function () {
              callback();
              return;
            });
          }
        }

      });

    });
  }
};


module.exports = serverServices;
