'use strict';

angular.module('aplayerApp')
  .directive('serverlist', function ($http, $state) {
    return {
      restrict: 'E',
      transclude: false,
      scope: {
        templateUrl: '@',
        servers: "="
      },
      template: "<div ng-include='templateUrl'></div>",
      link: function (scope, element, attr, ctrl) {

      },
      controller: function ($scope, $element, $attrs) {
        $scope.goServer = function(server_id) {
          $state.go("server.player",{server_id: server_id});
        };

        $scope.getServerStyle = function(i){
          return {
            "background-image":"url(images/servers/" + i + ".jpg)"
          }
        };
      }
    };
  })
;
