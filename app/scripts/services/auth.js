;
(function () {
  'use strict';
  angular
    .module('auth_service',[])
    .service('Auth', Auth)
    .factory('AuthHttpInterceptor', AuthHttpInterceptor);


  function Auth($http) {

    this.oauth = function(provider) {
      return $http.get("/api/auth/" + provider);
    };

    this.getAccessTokenFromUrl = function($stateParams) {
      if($stateParams.token)
        return $stateParams.token;
      else
        return false;
    };

    this.isLoggedIn = function() {
      if (localStorage.accessToken) {
        return true;
      }
      else {
        return false;
      }
    };

    this.logout = function() {
      localStorage.removeItem('accessToken');
    };
  };

  function AuthHttpInterceptor($q) {

    return {

      request: function (config) {
        config.headers = config.headers || {};
        if (localStorage.accessToken) {
          config.headers['x-access-token'] = localStorage.accessToken;
        }
        return config;
      },

      response: function (response) {
        return response || $q.when(response);
      },
      responseError: function (rejection) {
        if (rejection.status === 401) {
          console.log("Response Error 401", rejection);

          localStorage.removeItem("accessToken");

          $state.go('login');
        }
        return $q.reject(rejection);
      }
    }
  };


}).call(this);
