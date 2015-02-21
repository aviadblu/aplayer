'use strict';

/**
 * @ngdoc function
 * @name aplayerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the aplayerApp
 */
angular.module('aplayerApp')
  .controller('ClientsCtrl', ['$scope','$state','$stateParams','Client', function ($scope,$state,$stateParams,Client) {


    $scope.getServerStyle = function(i){
      return {
        "background-image":"url(images/servers/" + i + ".jpg)"
      }
    };

    var socket;
    var initSocket = function() {
      socket = io();
      socket.on("servers", function (data) {
        $scope.servers = data;
        $scope.$apply();
      });
    };

    initSocket();
    Client.fetchAll();

    $scope.goClient = function(server_id) {
      $state.go("app.client",{server_id: server_id});
    };
  }]);



