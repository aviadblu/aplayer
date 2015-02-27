'use strict';

/**
 * @ngdoc function
 * @name aplayerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the aplayerApp
 */
angular.module('aplayerApp')
  .controller('PlayerCtrl', ['$scope','$http','$timeout', '$state','$stateParams','Server','youtube','$modal',function ($scope, $http, $timeout, $state, $stateParams, Server, youtube, $modal) {

    $scope.test = function(event) {
      console.log("down")
    };

    $scope.key = "";

    $scope.searchSong = function() {
      if(this.key) {
        youtube.search({
          key: this.key
        })
          .success(function(data){
            $scope.results = data;
          });
      }
    };

    $scope.addSong = function(index) {

      var s = {
        name: $scope.results[index].snippet.title,
        id: $scope.results[index].id.videoId
      };

      addSongs([s]);

      $scope.results = null;
      this.key = "";
    };



    $scope.server_id = $stateParams.server_id;
    Server.getServerData($stateParams.server_id)
      .success(function (data, status, headers, config) {
        $scope.server_data = data;
        if(!$scope.tracks || $scope.tracks.length == 0 && data.tracks) {
          $scope.tracks = data.tracks;
        }

        if(!data.tracks) {
          $scope.tracks = [];
          $scope.empty_server = true;
        }

        loadSongsData();
        initSocket();
      }).
      error(function (data, status, headers, config) {

      });

    $scope.getServerStyle = function(i){
      return {
        "background-image":"url(images/servers/" + i + ".jpg)"
      }
    };

    $scope.getServerImage = function(i) {
      return "images/servers/" + i + ".jpg";
    };

    $scope.updateServer = function() {
      setTimeout(function(){
        Server.update($stateParams.server_id, {
          active: $scope.server_data.active
        });
      },500);
    };

    $scope.tracks = null;

    var addSongs = function(songs) {
      // TODO make unique
      $scope.tracks = $scope.tracks.concat(songs);
      trackC = 0;
      loadSongsData();
    };


    var trackC = 0;
    var loadSongsData = function() {
      if(!$scope.tracks[trackC]) {
        if($scope.empty_server && $scope.tracks.length > 0) {

          $scope.wait = true;
          $timeout(function(){
            $state.transitionTo($state.current, $stateParams, {
              reload: true,
              inherit: false,
              notify: true
            });
          },5000)

        }
        return;
      }



      if(typeof $scope.tracks[trackC].id !== "string") {
        $scope.tracks.splice(trackC,1);
        loadSongsData();
        return;
      }

      if(!$scope.tracks[trackC].extra_data) {
        youtube.loadExtraData($scope.tracks[trackC].id)
          .success(function(extra_data){
            $scope.tracks[trackC].extra_data = extra_data;
            trackC++;
            loadSongsData();
          })
      }
      else {
        trackC++;
        loadSongsData();
      }
    };

    $scope.loadPlaylist = function() {
      var modalInstance = $modal.open({
        backdrop: false,
        templateUrl: '/playlists.html',
        controller: 'PlaylistsCtrl',
        resolve: {}
      });

      modalInstance.result.then(function (songs) {
        addSongs(songs);
      }, function () {

      });
    };




    var socket;

    var initSocket = function() {

      socket = io();
      var line = 0;
      socket.on($scope.server_id, function (data) {
        addSongs([data.song]);
      });
    };

    $scope.playerVars = {
      controls: 1,
      autoplay: 0
    };


  }])







  // playlist modal controller
  .controller('PlaylistsCtrl', ['$scope','$modalInstance','User','youtube',function ($scope, $modalInstance, User, youtube) {

    $scope.close = function() {
      $modalInstance.dismiss('cancel');
    };

    $scope.new_playlist = false;

    var loadPlaylists = function() {
      User.loadPlayLists()
        .success(function(data){
          $scope.playlists = data;
          $scope.new_playlist = false;
        });
    };

    loadPlaylists();

    $scope.key = "";

    $scope.searchSong = function() {
      if(this.key) {
        youtube.search({
          key: this.key
        })
          .success(function(data){
            $scope.results = data;
            this.key = "";
            resetUsed();
          });
      }
    };


    $scope.playlist = {
        name: "",
        songs: []
    };


    $scope.addSong = function(index) {
      var song = $scope.results[index];
      var id = song.id.videoId;
      var exists = false;
      for(var i in $scope.playlist.songs) {
        if($scope.playlist.songs[i].id == id) {
          exists = true;
          $scope.results[index].used = true;
          break;
        }
      }

      if(!exists) {
        $scope.playlist.songs.push({
          name: song.snippet.title,
          id: song.id.videoId
        });

        $scope.results[index].used = true;
      }

    };

    $scope.createPlaylist = function() {
      if($scope.playlist.songs.length > 0) {

        $scope.playlist.name = prompt("Your list has " + $scope.playlist.songs.length + " songs, \n please give a name for this playlist:");
        if($scope.playlist.name) {
          $scope.loading = true;
          User.addPlaylist($scope.playlist)
            .success(function(data){
              $scope.loading = false;
              loadPlaylists();
            })
        }

      }
    };

    var resetUsed = function() {


      for(var k in $scope.results) {
        var result_song = $scope.results[k];
        var used = false;
        for(var l in $scope.playlist.songs) {
          var playist_song = $scope.playlist.songs[l];
          if(result_song.id.videoId == playist_song.id) {
            used = true;
            break;
          }
        }

        $scope.results[k].used = used;

      }

    };

    $scope.selectPlaylist = function(id) {
      $modalInstance.close($scope.playlists[id].songs);
    };

    $scope.removeSong = function(index) {
      $scope.playlist.songs.splice(index,1);
      resetUsed();
    };


    $scope.removePlaylist = function(id) {
      if(!confirm("Sure?"))
        return;
      User.delPlaylist(id);
      delete $scope.playlists[id];
    };
  }]);



