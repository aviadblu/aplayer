/**
 * Created by AVB on 1/6/2015.
 */
var config = require('../environment');
var Firebase = require('firebase');
var secret  = "XEq1AtzQnWDFohaUpwsmiSPZIFNmH0R8863eLFZA";
var firebase_ob = {
	get_env: function() {
		switch(config.env) {
			case "development":
				return new Firebase("https://aplayer-demo.firebaseio.com/");
			default:
				return new Firebase("https://aplayer-demo.firebaseio.com/");
		}
	}
};

module.exports = firebase_ob.get_env();
