'use strict';

angular.module('aplayerApp')
  .directive('player', function ($http, ngAudio) {
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
        $scope.setMarks = function(_audio) {
          var marks = 6;
          setTimeout(function(){
            var mark_html = '';
            var max = _audio.duration;
            var step = max/marks;
            var per_part = 100 / marks;
            for(var i=0; i<=marks;i++) {
              mark_html+='<div class="mark" style="left:'+(i*per_part)+'%" >'+$scope.getTimeFrameFormat(step*i)+'</div>';

              if(i<marks)
                mark_html+='<div class="half_mark" style="left:'+(i*per_part + (0.5*per_part))+'%" ></div>';
            }
            document.getElementById('frame_marks').innerHTML = mark_html;
          });

        };

        var currTrack;

        var setPlayer = function (_track) {

          if(currTrack == _track.name)
            return;

          currTrack = _track.name;

          $scope._audio = _track.audio;

          //console.log($scope._audio)

          //if($scope._audio.duration) {
          //  $scope.setMarks(_track.audio);
          //}
          //else {
          //  setTimeout(function(){
          //    $scope.setMarks(_track.audio);
          //  },1000)
          //}

          $scope._audio.data = {
            play_label: "Play",
            playing: false,
            pause: false,
            on_dock: false,
            prWatch: 0
          };

          $scope._audio.data.prWatch = $scope.$watch('_audio.currentTime', function() {
            //console.log($scope._audio.currentTime + "=" + $scope._audio.duration);

            if($scope._audio.duration && $scope._audio.currentTime == $scope._audio.duration) {
              console.log($scope._audio.currentTime + "=" + $scope._audio.duration);
                $scope.nextTrack();
            }
          });

          $scope._audio.actions = {
            play_pause: function () {
              if ($scope._audio.paused) {
                $scope._audio.actions.play();
              }
              else {
                $scope._audio.actions.pause();
              }
            },
            play: function () {
              $scope._audio.play();
              $scope._audio.data.play_label = "Pause";
              $scope._audio.data.playing = true;
              $scope._audio.data.on_dock = true;
              $scope._audio.data.pause = true;
            },
            pause: function () {
              $scope._audio.pause();
              $scope._audio.data.play_label = "Play";
              $scope._audio.data.playing = false;
              $scope._audio.data.pause = false;
            },
            stop: function() {
              $scope._audio.restart();
              $scope._audio.data.play_label = "Play";
              $scope._audio.data.playing = false;
              $scope._audio.data.on_dock = false;
              $scope._audio.data.pause = false;
            },
            mute: function () {
              $scope._audio.muting = !$scope._audio.muting;
            }


          };

        };

        $scope.getTimeFrameFormat = function(dec){
          // convert time in decimal format to ss:ff format for display
          var ss=String(dec).match(/(\d+)(\.\d+)?/);
          if(!ss) {
            return;
          }



          if(!ss[2]) {
            ss[2]=0;
          }

          ss[2]=parseInt(ss[2]*100);



          var total_sec = parseInt(ss[1]);

          var min = Math.floor(total_sec/60);

          var sec = total_sec - 60 * min;




          var m = min>=10?min:""+min;
          var s = parseInt(sec)>=10?sec:"0"+sec;
          var ds = parseInt(ss[2])>=10?ss[2]:"0"+ss[2];

          return m+":"+s;//+":"+ds;
        };

        $scope.dur2len = function(dur) {
          if(dur > 0) {
            return $scope.getTimeFrameFormat(dur); //60;
          }
          else {
            return "0:00";
          }

        };


        $scope.tracks = [];
        $scope.trackIndex = 0;


        var loadTrucks = function(dir) {
          $http.get('/api/songs/list?d=' + dir)
            .success(function (data) {
              for (var i in data) {

                var audio = ngAudio.load(data[i].path);

                $scope.tracks.push({
                  name: data[i].name,
                  path: data[i].path,
                  audio: audio
                });

              }

              setPlayer($scope.tracks[0]);

            });
        };

        loadTrucks($scope.tracksDir);


        $scope.loadMore = function() {
          loadTrucks("songs2");
        };




        $scope.setTrack = function(index) {
          $scope.trackIndex = index;
          var continue_play = false;
          if($scope._audio.data.playing) {
            continue_play = true;
          }

          $scope._audio.actions.stop();

          //$scope._audio.unbind();
          $scope._audio.data.prWatch();
          setPlayer($scope.tracks[index]);
          if(continue_play)
            $scope._audio.actions.play();
        };

        $scope.prevTrack = function() {
          if($scope.trackIndex > 0) {
            $scope.trackIndex--;

            setTimeout(function(){
              $scope._audio.data.prWatch();
              $scope._audio.actions.stop();
              setPlayer($scope.tracks[$scope.trackIndex]);
              $scope._audio.actions.play();
            },0);
          }
        };

        $scope.nextTrack = function() {
          $scope.trackIndex++;
          if($scope.tracks[$scope.trackIndex]) {

            setTimeout(function(){
              $scope._audio.data.prWatch();
              $scope._audio.actions.stop();
              setPlayer($scope.tracks[$scope.trackIndex]);
              $scope._audio.actions.play();
            },0);

          }
          else {
            $scope.trackIndex--;
          }
        };


        var socket;
        var uid = 87;
        var initSocket = function() {
          socket = io.connect("localhost:3000", {reconnect: true});
          socket.on('connect', function(socket) {
            console.log('Connected!');
          });
          var line = 0;
          socket.on(uid, function (data) {
            console.log(data);
            var audio = ngAudio.load(data.song.path);

            $scope.tracks.push({
              name: data.song.name,
              path: data.song.path,
              audio: audio
            });
          });
        };

        initSocket();


        // update server on list change
        var watcher = $scope.$watch('trackIndex', function() {
          // update player state:
          updateServer();
        });


        var updateServer = function() {

          // remove audio data:
          var tracks = [];
          for(var i in $scope.tracks) {
            tracks[i] = {
              name: $scope.tracks[i].name,
              length: $scope.getTimeFrameFormat($scope.tracks[i].audio.duration)
            };
          }


          $http.post('/api/songs/update_state',{
            uid: uid,
            tracks: tracks,
            trackIndex: $scope.trackIndex
          });
        };


        setInterval(updateServer,2500);

      }
  };
})
;
