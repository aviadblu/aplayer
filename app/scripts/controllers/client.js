'use strict';

/**
 * @ngdoc function
 * @name aplayerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the aplayerApp
 */
angular.module('aplayerApp')
  .controller('ClientCtrl', function ($scope, $stateParams) {


    $scope.server_id = $stateParams.server_id;

  });



