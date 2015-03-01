'use strict';

angular.module('aplayerApp')
  .directive('clientplayer', ['$http','player_service',function ($http,player_service) {
    return {
      restrict: 'E',
      transclude: false,
      scope: {
        templateUrl: '@',
        serverId: '@'
      },
      template: "<div ng-include='templateUrl'></div>",
      link: function (scope, element, attr, ctrl, transclude) {

      },
      controller: function ($scope, $element, $attrs) {

        var socket;
        var uid = $scope.serverId;
        var initSocket = function() {
          socket = io();
          var line = 0;
          socket.on(uid + "_client", function (data) {

            $scope.safeApply(function(){
              $scope.tracks = data.tracks;
              $scope.trackIndex = data.trackIndex;
              $scope.next_track = data.next_track;
            });
          });
        };

        initSocket();

        $scope.safeApply = function(fn) {
          var phase = this.$root.$$phase;
          if(phase == '$apply' || phase == '$digest') {
            if(fn && (typeof(fn) === 'function')) {
              fn();
            }
          } else {
            this.$apply(fn);
          }
        };

        $scope.getTracksThumb = function(track) {
          return player_service.getClosetSizeThumb(track, {width:130,height:110});
        };



      }
  };
}])
;
