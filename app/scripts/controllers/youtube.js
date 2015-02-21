'use strict';

/**
 * @ngdoc function
 * @name aplayerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the aplayerApp
 */
angular.module('aplayerApp')
  .controller('YoutubeCtrl', ['$scope','youtube',function ($scope, youtube) {

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

    $scope.setVideo = function(index) {
      console.log($scope.results[index].id.videoId)
      $scope.curr_track = $scope.results[index].id.videoId;
    };


    $scope.curr_track = "";

  }]);



