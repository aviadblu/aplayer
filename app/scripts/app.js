'use strict';

/**
 * @ngdoc overview
 * @name minovateApp
 * @description
 * # minovateApp
 *
 * Main module of the application.
 */
angular
  .module('aplayerApp', [
    'ui.router',
    'ui.bootstrap',
    'youtube-embed',
    'picardy.fontawesome',
    'ui.slimscroll',
    'auth_service',
    'server',
    'client',
    'youtube_service',
    'user',
    'player_service'
  ])
  .factory('principal', ['$q', '$http', '$timeout',
    function($q, $http, $timeout) {
      var _identity = undefined,
        _authenticated = false;

      return {
        isIdentityResolved: function() {
          return angular.isDefined(_identity);
        },
        isAuthenticated: function() {
          return _authenticated;
        },
        isInRole: function(role) {
          if (!_authenticated || !_identity.roles) return false;

          return _identity.roles.indexOf(role) != -1;
        },
        isInAnyRole: function(roles) {
          if (!_authenticated || !_identity.roles) return false;

          for (var i = 0; i < roles.length; i++) {
            if (this.isInRole(roles[i])) return true;
          }

          return false;
        },
        authenticate: function(identity) {
          _identity = identity;
          _authenticated = identity != null;
        },
        identity: function(force) {
          var deferred = $q.defer();

          if (force === true) _identity = undefined;

          // check and see if we have retrieved the identity data from the server. if we have, reuse it by immediately resolving
          if (angular.isDefined(_identity)) {
            deferred.resolve(_identity);

            return deferred.promise;
          }

          //otherwise, retrieve the identity data from the server, update the identity object, and then resolve.
          $http.get('/api/accounts/identity', { ignoreErrors: true })
           .success(function(data) {
             _identity = data;
             _authenticated = true;
             deferred.resolve(_identity);
           })
           .error(function () {
             _identity = null;
             _authenticated = false;
             deferred.resolve(_identity);
           });

          // for the sake of the demo, fake the lookup by using a timeout to create a valid
          // fake identity. in reality,  you'll want something more like the $http request
          // commented out above. in this example, we fake looking up to find the user is
          // not logged in
          // var self = this;
          // $timeout(function() {
          //   self.authenticate(null);
          //   deferred.resolve(_identity);
          // }, 1000);

          return deferred.promise;
        }
      };
    }
  ])
  .factory('authorization', ['$rootScope', '$state', 'principal',
    function($rootScope, $state, principal) {
      return {
        authorize: function() {
          return principal.identity()
            .then(function() {
              var isAuthenticated = principal.isAuthenticated();

              if ($rootScope.toState.data.roles && $rootScope.toState.data.roles.length > 0 && !principal.isInAnyRole($rootScope.toState.data.roles)) {
                if (isAuthenticated) $state.go('accessdenied'); // user is signed in but not authorized for desired state
                else {
                  // user is not authenticated. stow the state they wanted before you
                  // send them to the signin state, so you can return them when you're done
                  $rootScope.returnToState = $rootScope.toState;
                  $rootScope.returnToStateParams = $rootScope.toStateParams;

                  // now, send them to the signin state so they can log in
                  $state.go('login');
                }
              }
            });
        }
      };
    }
  ])

  .run(['$rootScope', '$state', '$stateParams', 'authorization', 'principal', function($rootScope, $state, $stateParams, authorization, principal) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.intervals = [];


    $rootScope.$on('$stateChangeSuccess', function(event, toState) {

      // clear all intervals:
      for(var i in $rootScope.intervals) {
        //console.log("clear interval: " + i);
        clearInterval($rootScope.intervals[i]);
      }

      event.targetScope.$watch('$viewContentLoaded', function () {

        angular.element('html, body, #content').animate({ scrollTop: 0 }, 200);

        setTimeout(function () {
          angular.element('#wrap').css('visibility','visible');

          if (!angular.element('.dropdown').hasClass('open')) {
            angular.element('.dropdown').find('>ul').slideUp();
          }
        }, 200);
      });
      $rootScope.containerClass = toState.containerClass;
    });


    $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
      // track the state the user wants to go to; authorization service needs this
      $rootScope.toState = toState;
      $rootScope.toStateParams = toStateParams;
      // if the principal is resolved, do an authorization check immediately. otherwise,
      // it'll be done when the state it resolved.
      if (principal.isIdentityResolved()) authorization.authorize();
    });
  }])


  .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {

    var rolesGroup = {
      all: ['Guest','User'],
      loggedIn: ['User']
    };


    $urlRouterProvider.otherwise(function() {
      return '/app/home';
    });


    $httpProvider.interceptors.push('AuthHttpInterceptor');

    $stateProvider

      .state('login', {
        url: '/login',
        controller: 'LoginCtrl',
        templateUrl: 'views/login.html'
      })

      .state('auth', {
        url: '/auth/:token',
        controller: 'AuthCtrl'
      })


      .state('server', {
        abstract: true,
        url: '/server',
        templateUrl: 'views/app.html',
        data: {
          roles: rolesGroup.loggedIn
        }
      })
      //player
      .state('server.player', {
        url: '/player/:server_id',
        controller: 'PlayerCtrl',
        templateUrl: 'views/player.html',
        data: {
          roles: rolesGroup.loggedIn
        }
      })

      .state('app', {
        abstract: true,
        url: '/app',
        templateUrl: 'views/app.html'
      })
      //home
      .state('app.home', {
        url: '/home',
        controller: 'HomeCtrl',
        templateUrl: 'views/home.html',
        data: {
          roles: rolesGroup.all
        }
      })
      .state('app.youtube', {
        url: '/youtube',
        controller: 'YoutubeCtrl',
        templateUrl: 'views/youtube.html',
        data: {
          roles: rolesGroup.all
        }
      })
      //client
      .state('app.client', {
        url: '/client/:server_id',
        controller: 'ClientCtrl',
        templateUrl: 'views/clientView.html',
        data: {
          roles: rolesGroup.all
        }
      })
      .state('app.clients', {
        url: '/clients',
        controller: 'ClientsCtrl',
        templateUrl: 'views/clientsView.html',
        data: {
          roles: rolesGroup.all
        }
      });
      ////////////////

  }]);
