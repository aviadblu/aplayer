'use strict';

angular.module('aplayerApp')
  .directive('usertop', function ($http, $state, principal) {
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


        $scope.principal = principal;



        if(principal.isAuthenticated()) {
          principal.identity()
          .then(function(data){
              $scope.user_data = data.user_data;
          });
        }

        // $scope.login = function() {
        //
        //   principal.identity()
        //   .then(function(data){
        //       $scope.user_data = data.user_data;
        //   });
        //
        // }

      }
    };
  })
;
