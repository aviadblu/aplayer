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
    'ngAudio'
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
          //$http.get('/api/accounts/identity', { ignoreErrors: true })
          //  .success(function(data) {
          //    _identity = data;
          //    _authenticated = true;
          //    deferred.resolve(_identity);
          //  })
          //  .error(function () {
          //    _identity = null;
          //    _authenticated = false;
          //    deferred.resolve(_identity);
          //  });

          // for the sake of the demo, fake the lookup by using a timeout to create a valid
          // fake identity. in reality,  you'll want something more like the $http request
          // commented out above. in this example, we fake looking up to find the user is
          // not logged in
          var self = this;
          $timeout(function() {
            self.authenticate(null);
            deferred.resolve(_identity);
          }, 1000);

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
    $rootScope.$on('$stateChangeSuccess', function(event, toState) {

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


  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {




    $urlRouterProvider.otherwise(function() {
      return '/app/player';
    });

    $stateProvider

      .state('app', {
        abstract: true,
        url: '/app',
        templateUrl: 'views/app.html'
      })
      //player
      .state('app.player', {
        url: '/player',
        controller: 'PlayerCtrl',
        templateUrl: 'views/player.html'
      })
      //player
      .state('app.client', {
        url: '/client',
        controller: 'ClientCtrl',
        templateUrl: 'views/client.html'
      })
      ////////////////

  }]);

