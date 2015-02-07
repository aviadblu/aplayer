'use strict';

/**
 * @ngdoc function
 * @name aplayerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the aplayerApp
 */
angular.module('aplayerApp')
  .controller('HomeCtrl', function ($scope, $http, $state) {
    $scope.createServer = function() {
      $state.go('server.player');
    };

    $scope.openGuest = function() {
      $state.go('app.client');
    };


  });
