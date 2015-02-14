var db = require('../../config/firebase/connection');
var accounts_db = db.child('accounts');
var uuid = require('node-uuid');

var accountsSrvices = {
  saveUser: function(user_data, callback) {
    var id;
    if(user_data.id) {
      id = user_data.id;
    }
    else {
      id = uuid.v1();
      user_data.id = id;
    }

    accounts_db.child(id).set(user_data, function () {
      callback();
    });
  },

  updateUser: function(user_id, user_data, callback) {
    user_data.id = user_id;
    accounts_db.child(user_id).update(user_data, function () {
      callback();
    });
  },

  getUser: function(token, callback) {
    var user = accounts_db.child(token);
    user.once("value", function(data) {
      var data = data.val();
      if(data) {
        callback(null, data);
      }
      else {
        callback("No such id!");
      }

    });
  },

  checkIfUserExists: function(user_data, callback){

    var facebook_id = user_data.facebook_id;

    accounts_db.once("value", function(data) {
      var data = data.val();
      if(!data) {
        callback(null, user_data);
      }
      else {
        var exists = false;
        var user_id;
        for(i in data) {
          if(data[i].facebook_id && data[i].facebook_id === facebook_id) {
            exists = true;
            user_id = i;
            break;
          }
        }
        if(exists) {
          callback(user_id, user_data);
        }
        else {
          callback(null, user_data);
        }
      }
    });
  }
};


module.exports = accountsSrvices;
