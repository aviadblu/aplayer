;
(function () {
  'use strict';
  angular
    .module('youtube_service',[])
    .service('youtube', ['$http', function($http){

      this.search = function(data) {
        return $http.get("/api/youtube/search?key=" + data.key);
      };

      this.loadExtraData = function(song_id) {
        return $http.get("/api/youtube/loadExtraData?songId=" + song_id);
      };

    }]);

}).call(this);
