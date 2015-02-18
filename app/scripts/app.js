(function() {
'use strict';

  angular.module('angularjsApp', [
    'ngRoute'
  ]);

  angular.module('angularjsApp')
    .config(configureRoutes)
    .config(configureHttpProvider)
    .run(onRun)
    .controller(ApplicationController)
    .factory(Session)
    .factory(AuthInterceptor);
 
  /* @ngInject */
  function configureRoutes($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      }).
      when('/home', {
        templateUrl: 'views/home.html',
        controller: 'TodoCtrl',
        data: {
            authorizedRoles: ['admin']
          }
      }).
      when('/todo/save', {
        templateUrl: 'views/addedit.html',
        controller: 'TodoCtrl',
        data: {
            authorizedRoles: ['admin']
          }
      }).
      otherwise({
        redirectTo: '/'
      });
  }

  /* @ngInject */
  function configureHttpProvider($httpProvider) {
    //CORS
    //$httpProvider.defaults.useXDomain = true;
    //$httpProvider.defaults.headers.common.['Accept'] = 'application/json'; // jshint ignore:line
    //$httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
    //delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $httpProvider.interceptors.push([
      '$injector',
      function ($injector) {
        return $injector.get('AuthInterceptor');
      }
    ]);
  }


  /* @ngInject */
  function onRun($rootScope, $location, AUTH_EVENTS, AuthService, Session, APPLICATION, PAGE_URL) {
    $rootScope.$on('$stateChangeStart', function (event, next) {
      var authorizedRoles = next.data.authorizedRoles;
      if (!AuthService.isAuthorized(authorizedRoles)) {
        event.preventDefault();
        if (AuthService.isAuthenticated()) {
          // user is not allowed
          $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
        } else {
          // user is not logged in
          $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
        }
      }
    });

    //hendled notAuthenticated event
    $rootScope.$on(AUTH_EVENTS.notAuthenticated, function (event, next) {
      $location.url(PAGE_URL.ROOT);
    });
    $rootScope.$on(AUTH_EVENTS.sessionTimeout, function (event, next) {
      $location.url(PAGE_URL.ROOT);
    });  

    if(Session.getValue(APPLICATION.authToken) !== null){
      $location.url(PAGE_URL.HOME);
    }
  }


/* @ngInject */
function AuthInterceptor($rootScope, $q, AUTH_EVENTS) {
  return {
    responseError: function (response) { 
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
        403: AUTH_EVENTS.notAuthorized,
        419: AUTH_EVENTS.sessionTimeout,
        440: AUTH_EVENTS.sessionTimeout
      }[response.status], response);
      return $q.reject(response);
    }
  };
}

/* @ngInject */
function ApplicationController($scope, $location, USER_ROLES, AuthService) {
  $scope.currentUser = null;
  $scope.userRoles = USER_ROLES;
  $scope.isAuthorized = AuthService.isAuthorized;
 
  $scope.setCurrentUser = function (user) {
    $scope.currentUser = user;
  };

  $scope.changeView = function (view) {
    $location.path(view);
  };
}

/* @ngInject */
function Session(APPLICATION, $log, $window) {
    var SessionObj = {
      create: function(sessionId, userName, userRole){
        var data = {};
        data[APPLICATION.authToken] = sessionId;
        data[APPLICATION.username] = userName;
        data[APPLICATION.role] = userRole;
        $window.localStorage.setItem('ang_session', JSON.stringify(data));
      },
      setValue: function(key, value) { 
        var data = {};
        try {
          data =  JSON.parse($window.localStorage.getItem(APPLICATION.sessionName));
        } catch (e) {
          $log.error('Error to get session data from local storage');
          return null;
        }
        data[key] = value;
        $window.localStorage.setItem('ang_session', JSON.stringify(data)); 
      },
      getValue: function(key) { 
        var data = {};
        try {
          data =  JSON.parse($window.localStorage.getItem(APPLICATION.sessionName));
          return data[key];
        } catch (e) {
          $log.error('Error to get session data from local storage');
          return null;
        }
        
      },
      remove: function(){
        var data = {};
        $window.localStorage.setItem(APPLICATION.sessionName, JSON.stringify(data));
      }
    };
  
    return SessionObj; 
  }
})();