;
(function () {
  'use strict';
  angular
    .module('server',[])
    .service('Server', Server);


  function Server($http) {
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

  };



}).call(this);
