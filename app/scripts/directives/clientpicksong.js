'use strict';

angular.module('aplayerApp')
  .directive('clientpicksong', function ($http, ngAudio) {
    return {
      restrict: 'E',
      transclude: false,
      scope: {
        templateUrl: '@',
        tracksDir: "@"
      },
      template: "<div ng-include='templateUrl'></div>",
      link: function (scope, element, attr, ctrl, transclude) {

      },
      controller: function ($scope, $element, $attrs) {
        $scope.songs = [];
        var loadTrucks = function(dir) {
          $http.get('/api/songs/list?d=' + dir)
            .success(function (data) {
              for (var i in data) {

                var audio = ngAudio.load(data[i].path);

                $scope.songs.push({
                  name: data[i].name,
                  path: data[i].path,
                  audio: audio
                });

              }


            });
        };

        loadTrucks($scope.tracksDir);

        var uid = 87;
        $scope.pickSong = function(index) {
          $http.post('/api/songs/pick',{
            uid: uid,
            song: {
              name: $scope.songs[index].name,
              path: $scope.songs[index].path
            }
          })
        };

      }
    };
  })
;
