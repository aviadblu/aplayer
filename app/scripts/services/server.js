;
(function () {
  'use strict';
  angular
    .module('server',[])
    .service('Server', ['$http', function($http){

      this.create = function(form) {
        return $http.post("/api/server/create",form);
      };

      this.getServerData = function(server_id) {
        return $http.get("/api/server/get-data?server_id=" + server_id);
      };

      this.update = function(server_id, server_data) {
        return $http.post("/api/server/update",{
          server_id: server_id,
          server_data: server_data
        });
      };

      this.sendSuggestion = function(server_id, song) {
        return $http.post("/api/server/sendSuggestion",{
          server_id: server_id,
          song: song
        });
      };

    }]);

}).call(this);
