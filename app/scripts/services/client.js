;
(function () {
  'use strict';
  angular
    .module('client',[])
    .service('Client', ['$http', function($http){

      this.fetchAll = function() {
        console.log("fetching all")
        return $http.get("/api/client/fetchAll");
      };

    }]);

}).call(this);
