'use strict';

angular.module('aplayerApp')
  .directive('player', ['$http', '$rootScope', '$timeout', '$interval', '$state', '$stateParams', 'principal', 'player_service', '$q', 'youtube', function ($http, $rootScope, $timeout, $interval, $state, $stateParams, principal, player_service, $q, youtube) {
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

        $scope.debug = true;

        $scope.yt_players = [];


        $scope.play_data = {
          players_ready: 0,
          background: "",
          status: "unstarted",
          user_status: "pause",
          timeToNext: "0:00",
          time: "0:00",
          completed: 0,
          volume: 100,
          playlist_index: 0,
          track_index: 0,
          track: null,
          next_track: null,
          buffered: false,
          original_index: 0
        };


        var checkYTPlayers = function() {
          $scope.play_data.players_ready = 0;
          for(var i in $scope.tracks) {
            try {
              if($scope.tracks_balanced[i].yt_player) {
                $scope.play_data.players_ready++;
              }
            }
            catch(e) {

            }
          }
          if($scope.play_data.players_ready < $scope.tracks.length) {
            $timeout(checkYTPlayers,500);
          }
          else {
            initPlaylist();
          }
        };

        var loadPlayer = function(index, callback) {
          var track = JSON.stringify($scope.tracks[index]);
          $scope.tracks_balanced[index] = JSON.parse(track);
          $scope.tracks_balanced[index].emiter_name = "emiter_" + index;


          $scope.$on($scope.tracks_balanced[index].emiter_name + '.ended', function ($event, player) {
            $scope.actions.trackEnded();
          });

          $scope.$on($scope.tracks_balanced[index].emiter_name + '.ready', function ($event, player) {
            applyPreset($scope.tracks_balanced[index].yt_player);
            callback();

          });
        };


        $scope.tracks_balanced = [];
        var nextLoad = 0;
        var loadPlayers = function() {
          if($scope.tracks[nextLoad]) {
            loadPlayer(nextLoad, function(){
              nextLoad++;
              $timeout(loadPlayers,100);
            })
          }
        };

        var applyPreset = function(player) {
          player.setVolume($scope.play_data.volume);
          player.unMute();
          player.seekTo(0);
          player.playVideo();
          player.pauseVideo();
        };

        var setViewInfo = function() {
          $scope.play_data.track = $scope.tracks_balanced[$scope.play_data.track_index];
          var next_playlist_index = playlistOrder.indexOf($scope.play_data.track_index) + 1;
          var next_track_index = typeof(playlistOrder[next_playlist_index]) !== 'undefined' ? playlistOrder[next_playlist_index] : playlistOrder[0];
          $scope.play_data.next_track = $scope.tracks_balanced[next_track_index];


          $scope.play_data.background = player_service.getBG($scope.tracks_balanced[$scope.play_data.track_index]);
        };



        $scope.player_ready = false;
        var playlistOrder = [];
        var initPlaylist = function() {
          for(var i in $scope.tracks) {
            playlistOrder[i] = parseInt(i);
          }

          if ($scope.options.shuffle) {
            playlistOrder = player_service.mixArray(playlistOrder);
          }
          $scope.play_data.playlist_index = 0;
          $scope.play_data.track_index = playlistOrder[$scope.play_data.playlist_index];
          setViewInfo();


          var intervalStart = (new Date()).valueOf().toString() + Math.random().toString();
          $rootScope.intervals[intervalStart] = $interval(loop, 200);

          var intervalStart = (new Date()).valueOf().toString() + Math.random().toString();
          $rootScope.intervals[intervalStart] = $interval(updateTracks,2000);


          $scope.player_ready = true;
        };

        var loopCounter = 0;

        var loop = function () {
          loopCounter++;
            $scope.actions.updateProgress();
            // update state:
            $scope.play_data.status = $scope.tracks_balanced[$scope.play_data.track_index].yt_player.currentState;
        };

        var updateTracks = function() {

          var next_playlist_index = $scope.play_data.playlist_index + 1;
          if(typeof(playlistOrder[next_playlist_index]) === 'undefined') {
            next_playlist_index = 0;
          }

          $http.post('/api/songs/update_state',{
            update_db: 1,
            uid: $scope.server_id,
            tracks: $scope.tracks,
            trackIndex: $scope.play_data.track_index,
            next_track: next_playlist_index
          });
        };

        // watch for new tracks
        var watcher = $scope.$watch('tracks.length', function() {
          updateTracks();
          if($scope.empty_server && $scope.tracks.length > 0) {

          }
        });

        var fixMissingTracksData = function(tracks, cb) {
          for(var i in tracks) {
            if(!tracks[i].extra_data) {
              // load
              youtube.loadExtraData(tracks[i].id)
                .success(function(extra_data){
                  tracks[i].extra_data = extra_data;
                });
              console.log("fixing song missing data");
            }
          }

          updateTracks();
          cb();
        };



        $scope.init_players = function() {
          if($scope.empty_server) {
            return;
          }

          fixMissingTracksData($scope.tracks,function(){
            loadPlayers();
            checkYTPlayers();
          });

        };

        $scope.actions = {
          setTrackByOriginalIndex: function(index) {
            $scope.play_data.track_index = index;
            $scope.actions.applyIndex();
          },

          applyIndex: function() {
            setViewInfo();
            for(var i in $scope.tracks_balanced) {
              // check if playing:
              var player = $scope.tracks_balanced[i].yt_player;
              var state = player.getPlayerState();
              if(state >= 1) {
                player.stopVideo();
              }
            }

            $scope.play_data.background = player_service.getBG($scope.tracks_balanced[$scope.play_data.track_index]);

            if($scope.play_data.user_status == "play") {
              $scope.tracks_balanced[$scope.play_data.track_index].yt_player.playVideo();
            }

          },

          trackEnded: function() {
            $scope.actions.next();
          },

          play_pause: function() {
            if($scope.play_data.user_status == "play") {
              $scope.play_data.user_status = "pause";
              $scope.tracks_balanced[$scope.play_data.track_index].yt_player.pauseVideo();
            }
            else {
              $scope.play_data.user_status = "play";
              $scope.tracks_balanced[$scope.play_data.track_index].yt_player.playVideo();
            }
          },

          next: function() {
            var next_playlist_index = $scope.play_data.playlist_index + 1;
            if(typeof(playlistOrder[next_playlist_index]) === 'undefined') {
              next_playlist_index = 0;
            }
            $scope.play_data.playlist_index = next_playlist_index;
            $scope.play_data.track_index = playlistOrder[next_playlist_index];
            $scope.actions.applyIndex();
          },

          prev: function() {
            var prev_playlist_index = $scope.play_data.playlist_index - 1;
            if(prev_playlist_index < 0) {
              prev_playlist_index = playlistOrder.length - 1;
            }
            $scope.play_data.playlist_index = prev_playlist_index;
            $scope.play_data.track_index = playlistOrder[prev_playlist_index];
            $scope.actions.applyIndex();
          },

          goToTime: function(event) {
            var track = $scope.tracks_balanced[$scope.play_data.track_index];
            var progressWidth = document.getElementById("progress_wrap").clientWidth;
            var gotTo = Math.floor(track.extra_data.duration.length * (event.offsetX/progressWidth));

            track.yt_player.playVideo();
            track.yt_player.pauseVideo();
            track.yt_player.seekTo(gotTo);

            if($scope.play_data.user_status == "pause") {
              $scope.actions.updateProgress();
            }
            else {
              track.yt_player.playVideo();
            }
          },

          updateProgress: function() {
            try {
              var track = $scope.tracks_balanced[$scope.play_data.track_index];
              var track_length = track.extra_data.duration.length;
              var time = track.yt_player.getCurrentTime();
              var time_left = Math.floor(track_length - time);
              $scope.play_data.timeToNext = player_service.getTimeFrameFormat(time_left);

              $scope.play_data.completed = Math.floor(time/track_length * 100);
              $scope.progress_style = {
                width: time/track_length * 100 + "%"
              };

              var fixed_time = player_service.getTimeFrameFormat(Math.floor(time));
              $scope.play_data.time = fixed_time;
              $scope.tracks[$scope.play_data.track_index].currTime = fixed_time;

              $scope.safeApply(function () {});
            }
            catch(e) {
              //console.log("Update progress error: " + e);
            }
          },

          removeSong: function(index) {
            if($scope.tracks.length <= 1) {
              alert("Error")
              return;
            }

            if(index == $scope.play_data.track_index) {
              $scope.actions.next();
            }

            var next_playlist_index = $scope.play_data.playlist_index + 1;
            if(typeof(playlistOrder[next_playlist_index]) === 'undefined') {
              next_playlist_index = 0;
            }


            $scope.tracks.splice(index,1);
            $scope.tracks_balanced.splice(index,1);

            playlistOrder.splice(playlistOrder.indexOf(index),1);


            if(index == next_playlist_index) {
              setViewInfo();
            }

          }

        };



        $scope.smallestThumb = function(track) {
          return player_service.getSmallestThumb(track);
        };

        $scope.getTracksThumb = function(track) {
          return player_service.getClosetSizeThumb(track, {width:130,height:110});
        };

        $scope.addSongToList = function(index) {
          var song = $scope.results[index];

          var new_track = {
            name: song.snippet.title,
            id: song.id.videoId
          };

          youtube.loadExtraData(new_track.id)
            .success(function(extra_data){
              new_track.extra_data = extra_data;
              var index = $scope.tracks.length;
              $scope.tracks[index] = new_track;
              loadPlayer(index,function(){
                $scope.results = null;
                $scope.key = "";
              });
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
