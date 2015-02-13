var config = require('../../config/environment');
var db = require('../../config/firebase/connection');
var accounts_db = db.child('accounts');



var accounts = {
    identity: function(req, res) {
        var userData = {
            status: "ok",
            roles: ["User"],
            user_data: {
                name: "Aviad Blumenfeld",
                image: "images/aviad.jpg"
            }
        };
        console.log("~~~~~~user identify: ~~~~");
        console.log(userData);
        console.log("~~~~~~user identify: ~~~~");
        return res.send(userData);
    },
    test: function() {
      console.log("save data in the database");

      var user_data = {
        name: "aviad"
      };

      accounts_db.set(user_data, function(err){
        console.log(err);
        console.log("Saved!");
      });
    }
};

module.exports = accounts;
