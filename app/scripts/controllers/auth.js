'use strict';

/**
 * @ngdoc function
 * @name aplayerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the aplayerApp
 */
angular.module('aplayerApp')
  .controller('AuthCtrl', function ($scope,$state,$stateParams,Auth) {

    var accessToken = Auth.getAccessTokenFromUrl($stateParams);
    if (accessToken) {
        localStorage.accessToken = accessToken;
        $state.go('app.home');
    }
    else {
      alert("error")
    }



  });



