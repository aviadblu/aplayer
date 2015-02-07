var config = require('../../config/environment');

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
    }
};

module.exports = accounts;
