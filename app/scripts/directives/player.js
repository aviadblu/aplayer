'use strict';

angular.module('aplayerApp')
  .directive('player', ['$http','$rootScope','ngAudio','principal',function ($http, $rootScope, ngAudio, principal) {
    return {
      restrict: 'E',
      templateUrl: "views/directives/player.html",
      link: function (scope, element, attr, ctrl) {


      },
      controller: function ($scope, $element, $attrs) {

        $scope.currTrackTime = getTimeFrameFormat(0);

        $scope.actions = {

          init: function() {
            $scope.currTrack = 0;


            //$scope.$on('youtube.player.ready', function ($event, player) {
            //
            //});

            $scope.$on('youtube.player.playing', function ($event, player) {
              $scope.tracks[$scope.currTrack].playing = true;
            });

            $scope.$on('youtube.player.paused', function ($event, player) {
              $scope.tracks[$scope.currTrack].playing = false;
            });

            $scope.$on('youtube.player.ended', function ($event, player) {
              $scope.actions.trackEnded();
            });



            //$scope.$on('youtube.player.queued', function ($event, player) {
            //  console.log("init queued");
            //});

            // get current time:
            var intervalStart = (new Date()).valueOf().toString() + Math.random().toString();
            $rootScope.intervals[intervalStart] = setInterval(function(){
              if($scope.player) {
                $scope.safeApply(function(){

                  try {
                    if($scope.player) {
                      var time = $scope.player.getCurrentTime();
                      $scope.currTrackTime = getTimeFrameFormat(Math.floor(time));
                      $scope.tracks[$scope.currTrack].currTime = $scope.currTrackTime;
                    }
                  }
                  catch(e) {

                  }

                })
              }

            },500);



            var intervalStart = (new Date()).valueOf().toString() + Math.random().toString();
            $rootScope.intervals[intervalStart] = setInterval(updateServer,2500);


            var intervalStart = (new Date()).valueOf().toString() + Math.random().toString();
            $rootScope.intervals[intervalStart] = setInterval(updateTracks,8000);


          },


          play_pause: function() {

            if($scope.tracks[$scope.currTrack].playing) {
              $scope.player.pauseVideo();
              $scope.tracks[$scope.currTrack].playing = false;
            }
            else {
              $scope.player.playVideo();
              $scope.tracks[$scope.currTrack].playing = true;
            }

          },

          setTrack: function(index, autoplay) {
            $scope.currTrack = index;
            $scope.player.stopVideo();

            $scope.currTrackTime = getTimeFrameFormat(0);
            $scope.tracks[$scope.currTrack].currTime = $scope.currTrackTime;


            for(var i in $scope.tracks) {
              $scope.tracks[i].playing = false;
            }


            $scope.$on('youtube.player.ready', function ($event, player) {
              if(autoplay) {
                $scope.player.playVideo();
                $scope.tracks[$scope.currTrack].playing = true;
              }
            });
          },

          prevTrack: function() {
            if($scope.currTrack <=0)
              return;

            var onplaying = $scope.tracks[$scope.currTrack].playing;
            $scope.actions.setTrack($scope.currTrack-1,onplaying);
          },

          nextTrack: function(autoplay) {
            var nextTrack = $scope.tracks[$scope.currTrack+1];
            if(nextTrack) {
              var onplaying = $scope.tracks[$scope.currTrack].playing;
              $scope.actions.setTrack($scope.currTrack+1,autoplay || onplaying);
            }
          },

          trackEnded: function() {
            $scope.actions.nextTrack(true);
          },

          removeSong: function(index) {
            if(index == $scope.currTrack) {
              $scope.actions.nextTrack();
            }
            $scope.tracks.splice(index,1);
          }

        };



        var serverId = $scope.server_id;
        var init = function() {
          var servers;
          principal.identity()
            .then(function (data) {
              servers = data.servers;

              for(var i in servers) {
                if(servers[i].id == $scope.serverId) {
                  serverId = $scope.serverId;
                }
              }

              if(serverId) {



                //loadLocalTrucks("songs/1");
                //initSocket();
                //var intervalStart = new Date().getTime();
                //$rootScope.intervals[intervalStart] = setInterval(updateServer,2500);

              }

            });
        };








        // update server on list change
        var watcher = $scope.$watch('trackIndex', function() {
          // update player state:
          updateServer();
        });


        var updateServer = function() {
          $http.post('/api/songs/update_state',{
            uid: serverId,
            tracks: $scope.tracks,
            trackIndex: $scope.currTrack
          });
        };

        var updateTracks = function() {
          $http.post('/api/songs/update_state',{
            update_db: 1,
            uid: serverId,
            tracks: $scope.tracks,
            trackIndex: $scope.currTrack
          });
        };






        function getTimeFrameFormat(dec) {
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
        }

        $scope.safeApply = function(fn) {

          try {
            var phase = this.$root.$$phase;
            if(phase == '$apply' || phase == '$digest') {
              if(fn && (typeof(fn) === 'function')) {
                fn();
              }
            } else {
              this.$apply(fn);
            }
          }
          catch(e) {
            console.log("safe apply error: " + e);
          }

        };

      }
  };
}])
;
