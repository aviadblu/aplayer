;
(function () {
  'use strict';
  angular
    .module('client',[])
    .service('Client', Client);


  function Client($http) {
    this.fetchAll = function() {
      return $http.get("/api/client/fetchAll");
    };

  };



}).call(this);
