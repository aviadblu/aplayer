'use strict';

/**
 * @ngdoc function
 * @name aplayerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the aplayerApp
 */
angular.module('aplayerApp')
  .controller('HomeCtrl', ['$scope','$http','$state','Auth','$modal','principal', function ($scope, $http, $state, Auth, $modal, principal) {

    $scope.auth = Auth;

    $scope.createServer = function () {
      if (Auth.isLoggedIn()) {
        var modalInstance = $modal.open({
          templateUrl: '/new_server.html',
          controller: 'NewServerCtrl',
          resolve: {}
        });

        modalInstance.result.then(function (server_id) {
          $state.go("server.player",{server_id: server_id});
        }, function () {

        });
      }
      //$state.go('server.player');
    };

    $scope.openGuest = function () {
      $state.go('app.clients');
    };


    principal.identity()
      .then(function (data) {
        $scope.servers = data.servers;
      });


  }])
  .controller('NewServerCtrl', ['$scope','$modalInstance','Server', function ($scope, $modalInstance, Server) {
    $scope.server_form = {
      private: 0
    };

    $scope.loading = false;
    $scope.createServer = function () {
      if (this.server_form.name) {
        $scope.loading = true;
        Server.create(this.server_form)
          .success(function (data, status, headers, config) {
            $scope.loading = false;
              $modalInstance.close(data.id);
          }).
          error(function (data, status, headers, config) {

          });
      }
    };
  }]);
