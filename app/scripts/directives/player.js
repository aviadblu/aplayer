'use strict';

angular.module('aplayerApp')
  .directive('player', ['$http', '$rootScope', '$timeout', 'principal', 'player_service', '$q', function ($http, $rootScope, $timeout, principal, player_service, $q) {
    return {
      restrict: 'E',
      templateUrl: "views/directives/player.html",
      link: function (scope, element, attr, ctrl) {


      },
      controller: function ($scope, $element, $attrs) {

        $scope.options = {
          shuffle: true,
          buffer_space: 20
        };

        $scope.debug = false;


        $scope.play_data = {
          background: "",
          status: "paused",
          player: 0,
          timeToNext: "0:00",
          time: "0:00",
          completed: 0,
          volume: 100,
          track_index: 0,
          track: null,
          next_track: null,
          buffered: false,
          original_index: 0
        };

        $scope.player_id = ["", ""];


        //var trackList;
        var init = function () {
          if ($scope.options.shuffle) {
            // shuffling tracks ...
            $scope.trackList = player_service.mixArray($scope.tracks, true);
          }
          else {
            $scope.trackList = player_service.mixArray($scope.tracks, false);
          }

          var intervalStart = (new Date()).valueOf().toString() + Math.random().toString();
          $rootScope.intervals[intervalStart] = setInterval(updateServer,2500);


          var intervalStart = (new Date()).valueOf().toString() + Math.random().toString();
          $rootScope.intervals[intervalStart] = setInterval(updateTracks,8000);

          $scope.actions.setTrack($scope.play_data.track_index);
          $scope.actions.preparePlayer(true)
            .then(function (player) {

              $scope.$on('youtube.player.ended', function ($event, player) {
                $scope.actions.trackEnded(player);
              });

              var intervalStart = (new Date()).valueOf().toString() + Math.random().toString();
              $rootScope.intervals[intervalStart] = setInterval(loop, 200);


            });



        };


        $scope.actions = {
          selectTrack: function(original_index) {
            var now_index;
            for(var i in $scope.trackList) {
              if($scope.trackList[i].original_index == original_index) {
                now_index = i;
                break;
              }
            }

            $scope.play_data.track_index = now_index;
            $scope.actions.setTrack($scope.play_data.track_index);
            $scope.actions.applyNewTrack();
          },

          setTrack: function (index) {

            $scope.play_data.track = $scope.trackList[index];

            $scope.play_data.background = player_service.getBG($scope.play_data.track);

            // set view track as playing
            var i = $scope.trackList[index].original_index;
            $scope.currTrack = i;
            $scope.play_data.original_index = i;


            if ($scope.trackList[index + 1]) {
              $scope.play_data.next_track = $scope.trackList[index + 1];
            }
            else {
              $scope.play_data.next_track = $scope.trackList[0];
            }
          },

          preparePlayer: function (start) {
            var deferred = $q.defer();

            if (start) {
              $scope.player_id[0] = $scope.play_data.track.id;
            }
            else {
              var p = $scope.play_data.player == 1 ? 0 : 1;
              $scope.player_id[p] = $scope.play_data.next_track.id;
            }

            $scope.$on('youtube.player.ready', function ($event, player) {
              $scope.actions.applyPreset(player);
              deferred.resolve(player);
            });

            return deferred.promise;

          },

          play_pause: function () {
            if ($scope.play_data.status == "paused") {
              $scope.play_data.status = "playing";
              $scope.yt_player[$scope.play_data.player].playVideo();

            }
            else {
              $scope.play_data.status = "paused";
              $scope.yt_player[$scope.play_data.player].pauseVideo();
            }

            $scope.safeApply(function () {
            });
          },

          next: function() {

            if (!$scope.trackList[$scope.play_data.track_index + 1]) {
              $scope.play_data.track_index = 0;
            }
            else {
              var index = $scope.play_data.track_index + 1;
              $scope.play_data.track_index = index;
            }
            try {
              $scope.yt_player[$scope.play_data.player].stopVideo();
            }
            catch(e) {}

            $scope.actions.setTrack($scope.play_data.track_index);
            $scope.actions.applyNewTrack();

          },

          prev: function() {
            if($scope.play_data.track_index > 0) {
              try {
                $scope.yt_player[$scope.play_data.player].stopVideo();
              }
              catch(e) {

              }
              $scope.play_data.track_index--;
              $scope.actions.applyNewTrack();
            }
          },

          applyNewTrack: function() {
            $scope.actions.setTrack($scope.play_data.track_index);
            $scope.actions.preparePlayer(true)
              .then(function(){
                $timeout(function(){
                  $scope.actions.switchSong($scope.play_data.track_index, false, true);
                },300);
              });
          },

          applyPreset: function (player) {
            player.setVolume($scope.play_data.volume);
          },

          buffer_next: function() {

            $scope.actions.preparePlayer();
            $scope.play_data.buffered = true;
          },

          trackEnded: function(player) {
            if (!$scope.trackList[$scope.play_data.track_index + 1]) {
              //if ($scope.options.shuffle) {
              //  // shuffling tracks ...
              //  $scope.trackList = player_service.mixArray($scope.tracks, true);
              //}
              //else {
              //  $scope.trackList = player_service.mixArray($scope.tracks, false);
              //}
              $scope.play_data.track_index = 0;
            }
            else {
              $scope.play_data.track_index++;
            }

            // set new view
            $scope.actions.setTrack($scope.play_data.track_index);


            $scope.actions.switchSong($scope.play_data.track_index, true);
          },

          setSong: function(track_index) {
            var index;
            for(var i in $scope.trackList) {
              if(track_index == $scope.trackList[i].original_index) {
                index = i;
                break;
              }
            }
            $scope.play_data.track_index = index;
            $scope.actions.setTrack(index);

            $scope.actions.preparePlayer(true)
              .then(function(p){
                $scope.actions.switchSong(index);
              });


          },

          switchSong: function(index, switch_player, reset_player) {
            try {
              $scope.yt_player[0].stopVideo();
              $scope.yt_player[1].stopVideo();
            }
            catch(e) {

            }

            // switch player
            var p;
            if(switch_player) {
              p = $scope.play_data.player == 1 ? 0 : 1;
            }
            else {
              p = $scope.play_data.player;
            }

            $scope.play_data.player = p;
            if(reset_player) {
              $scope.play_data.player = 0;
            }

            if($scope.play_data.status == "playing") {
              $scope.yt_player[$scope.play_data.player].playVideo();
            }

            // rest buffer
            $scope.play_data.buffered = false;
            $scope.safeApply(function () {});
          }
        };


        init();

        var loop = function () {
          if ($scope.yt_player[$scope.play_data.player]) {

            if ($scope.play_data.status == "playing") {

              var track_length = $scope.play_data.track.extra_data.duration.length;
              var time = $scope.yt_player[$scope.play_data.player].getCurrentTime();
              var time_left = Math.floor(track_length - time);
              $scope.play_data.timeToNext = player_service.getTimeFrameFormat(time_left);

              $scope.play_data.completed = Math.floor(time/track_length * 100);
              $scope.progress_style = {
                width: time/track_length * 100 + "%"
              };

              if($scope.options.buffer_space > time_left && !$scope.play_data.buffered) {
                $scope.actions.buffer_next();
              }

              var fixed_time = player_service.getTimeFrameFormat(Math.floor(time));
              $scope.play_data.time = fixed_time;


              $scope.tracks[$scope.trackList[$scope.play_data.track_index].original_index].currTime = fixed_time;

            }

            $scope.safeApply(function () {});
          }
        };

        $scope.smallestThumb = function(track) {
          return player_service.getSmallestThumb(track);
        };

        $scope.getTracksThumb = function(track) {
          return player_service.getClosetSizeThumb(track, {width:130,height:110});
        };

        // update server on list change
        var watcher = $scope.$watch('play_data.track_index', function() {
          // update player state:
          updateServer();
        });


        var updateServer = function() {
          console.log("update")
          $http.post('/api/songs/update_state',{
            uid: $scope.server_id,
            tracks: $scope.tracks,
            trackIndex: $scope.currTrack
          });
        };

        var updateTracks = function() {
          $http.post('/api/songs/update_state',{
            update_db: 1,
            uid: $scope.server_id,
            tracks: $scope.tracks,
            trackIndex: $scope.currTrack
          });
        };


        $scope.safeApply = function (fn) {

          try {
            var phase = this.$root.$$phase;
            if (phase == '$apply' || phase == '$digest') {
              if (fn && (typeof(fn) === 'function')) {
                fn();
              }
            } else {
              this.$apply(fn);
            }
          }
          catch (e) {
            console.log("safe apply error: " + e);
          }

        };


      }
    };
  }])
;
