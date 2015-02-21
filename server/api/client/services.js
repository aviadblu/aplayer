var db = require('../../config/firebase/connection');
var accounts_db = db.child('accounts');
var sync_data = require("./sync_data")
var uuid = require('node-uuid');

var clientServices = {
  listenAllClients: function () {
    var public_servers = {};
    accounts_db.on("value", function (data) {
      var data = data.val();
      if (!data)
        return;



      for (var u in data) {
        for (s in data[u].servers) {
          var server_Id = data[u].servers[s].id;



          if (data[u].servers[s].active == 1 && data[u].servers[s].private == 0) {
            public_servers[server_Id] = {
              id: server_Id,
              name: data[u].servers[s].name,
              rand_no: data[u].servers[s].rand_no,
              user: {
                name: data[u].display_name,
                photo: data[u].photo
              }
            };
          }
          else {
            delete public_servers[server_Id];
          }

        }
      }
      //console.log("+++++++ public servers ++++++++")
      //console.log(public_servers);
      sync_data.emit("servers",public_servers);
    });
  }
};


module.exports = clientServices;
