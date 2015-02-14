'use strict';

/**
 * @ngdoc function
 * @name aplayerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the aplayerApp
 */
angular.module('aplayerApp')
  .controller('PlayerCtrl', function ($scope, $http, $stateParams, Server) {

    $scope.server_id = $stateParams.server_id;
    Server.getServerData($stateParams.server_id)
      .success(function (data, status, headers, config) {
        $scope.server_data = data;
      }).
      error(function (data, status, headers, config) {

      });

    $scope.getServerStyle = function(i){
      return {
        "background-image":"url(images/servers/" + i + ".jpg)"
      }
    };

    $scope.updateServer = function() {
      setTimeout(function(){
        Server.update($stateParams.server_id, {
          active: $scope.server_data.active
        });
      },500);
    };


  });



