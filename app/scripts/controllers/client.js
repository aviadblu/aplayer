'use strict';

/**
 * @ngdoc function
 * @name aplayerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the aplayerApp
 */
angular.module('aplayerApp')
  .controller('ClientCtrl', ['$scope','youtube','$modal','$stateParams', function ($scope, youtube, $modal, $stateParams) {


    $scope.server_id = $stateParams.server_id;

    $scope.serach = function() {
      if(this.key) {
        youtube.search({
          key: this.key
        })
          .success(function(data){
            $scope.results = data;
          });
      }
    };

    $scope.suggest = function(index) {
      var modalInstance = $modal.open({
        backdrop: false,
        templateUrl: '/suggest.html',
        controller: 'SuggestCtrl',
        resolve: {
          data: function () {
            return {
              server_id: $scope.server_id,
              song: $scope.results[index]
            }
          }
        }
      });

      modalInstance.result.then(function () {

      }, function () {

      });
    };

  }])
  .controller('SuggestCtrl', [ '$scope', 'data', '$modalInstance', 'Server' ,function ($scope, data, $modalInstance, Server) {


      $scope.song = data.song;

      $scope.close = function() {
        $modalInstance.dismiss('cancel');
      };


    var songToSend = {
      name: data.song.snippet.title,
      id: data.song.id.videoId
    };

    $scope.sendSuggestion = function() {
      Server.sendSuggestion(data.server_id, songToSend)
        .success(function(){
          $modalInstance.close();
        });
    };

  }]);



