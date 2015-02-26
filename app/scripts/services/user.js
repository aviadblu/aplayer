;
(function () {
  'use strict';
  angular
    .module('user',[])
    .service('User', ['$http', function($http){

      this.addPlaylist = function(playlist) {
        return $http.post("/api/user/addPlaylist", playlist);
      };

      this.loadPlayLists = function() {
        return $http.get("/api/user/loadPlaylist");
      };

      this.delPlaylist = function(id) {
        return $http.post("/api/user/delPlaylist", {id:id});
      };

    }]);

}).call(this);
