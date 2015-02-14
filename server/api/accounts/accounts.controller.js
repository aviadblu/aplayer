var config = require('../../config/environment');
var accountsSrvices = require('./services');

var accounts = {
  tempTokens: {},
  identity: function (req, res) {
    var Guest = {
      status: "ok",
      roles: ["Guest"],
      user_data: {
        name: "Guest",
        image: "images/guest.jpg"
      }
    };

    if(req.get('x-access-token')) {
      //token exists:
      var accessToken = req.get('x-access-token');
      accountsSrvices.getUser(accessToken,function(err, user){
          if(err) {
            console.log(err);
            return res.status(400).send(err);
          }
          else {
            var ui_user = {
              status: "ok",
              roles: ["User"],
              user_data: {
                name: user.display_name,
                image: user.photo
              }
            };
            return res.send(ui_user);
          }
      })
    }
    else {
      return res.send(Guest);
    }
  },

  updateUser: function (user_data, callback) {
    accountsSrvices.checkIfUserExists(user_data, function(user_id,user_data){
      if(!user_id) {
        accountsSrvices.saveUser(user_data,function(){
          callback(user_data);
        });
      }
      else {
        accountsSrvices.updateUser(user_id, user_data,function(){
          callback(user_data);
        });
      }
    });

  }
};

module.exports = accounts;
