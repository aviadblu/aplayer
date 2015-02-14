'use strict';

angular.module('aplayerApp')
  .directive('usertop', function ($http, $state, principal, Auth) {
    return {
      restrict: 'E',
      transclude: false,
      scope: {
        templateUrl: '@'
      },
      template: "<div ng-include='templateUrl'></div>",
      link: function (scope, element, attr, ctrl, transclude) {

      },
      controller: function ($scope, $element, $attrs) {


        $scope.auth = Auth;


        principal.identity()
          .then(function (data) {
            $scope.user_data = data.user_data;
          });


        $scope.logout = function () {
          Auth.logout();
          principal.identity()
            .then(function (data) {
              $scope.user_data = data.user_data;
            });

        }

      }
    };
  })
;
