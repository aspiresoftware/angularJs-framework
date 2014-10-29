'use strict';


var app = angular.module('Constants', []);

app.constant('APPLICATION', {
    'host' : 'http://192.168.1.13:9000/',
    'sessionName': 'ang_session',
    'authToken': 'token',
    'username' : 'username',
    'role' : 'role'
});

app.constant('REST_URL', {
    'AUTHENTICATION': 'authentication',
    'TODO_LIST': 'todos',
    'SAVE_TODO': 'todo/save',
    'DELETE_TODO': 'todo/delete',
});

app.constant('PAGE_URL', {
    'ROOT': '/',
    'HOME': '/home',
});

app.constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
});

app.constant('USER_ROLES', {
  all: '*',
  admin: 'admin',
  user: 'user',
  guest: 'guest'
});
'use strict';

/**
 * @ngdoc overview
 * @name angularjsApp
 * @description
 * # angularjsApp
 *
 * Main module of the application.
 */
var app = angular.module('angularjsApp', ['ngRoute', 'loginController','todoController','userServices','Constants']);

 // Angular supports chaining, so here we chain the config function onto
  // the module we're configuring.
  app.config(['$routeProvider',function($routeProvider) {
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
  }]);

app.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.defaults.headers.common['Accept'] = 'application/json';
        $httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
]);


app.run(["$rootScope", "$location", "AUTH_EVENTS", "AuthService", "Session", "APPLICATION", "PAGE_URL", function ($rootScope, $location, AUTH_EVENTS, AuthService, Session, APPLICATION,PAGE_URL) {
  
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

  if(Session.getValue(APPLICATION.authToken) != null){
    $location.url(PAGE_URL.HOME);
  }
}]);

app.config(["$httpProvider", function ($httpProvider) {
  $httpProvider.interceptors.push([
    '$injector',
    function ($injector) {
      return $injector.get('AuthInterceptor');
    }
  ]);
}])

app.factory('AuthInterceptor', ["$rootScope", "$q", "AUTH_EVENTS", function ($rootScope, $q, AUTH_EVENTS) {
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
}])

app.controller('ApplicationController', ["$scope", "$location", "USER_ROLES", "AuthService", function ($scope, $location, USER_ROLES, AuthService) {
  $scope.currentUser = null;
  $scope.userRoles = USER_ROLES;
  $scope.isAuthorized = AuthService.isAuthorized;
 
  $scope.setCurrentUser = function (user) {
    $scope.currentUser = user;
  };

  $scope.changeView = function (view) {
    $location.path(view);
  };
}]);

app.factory('Session', ["APPLICATION", function(APPLICATION) {
  

  var Session = {
    create: function(sessionId, userName, userRole){
      var data = {};
      data[APPLICATION.authToken] = sessionId;
      data[APPLICATION.username] = userName;
      data[APPLICATION.role] = userRole;
      window.localStorage.setItem('ang_session', JSON.stringify(data));
    },
    setValue: function(key, value) { 
      var data = {};
      try {
        data =  JSON.parse(window.localStorage.getItem(APPLICATION.sessionName));
      } catch (e) {
        console.log('Error to get session data from local storage');
        return null;
      }
      data[key] = value;
      window.localStorage.setItem('ang_session', JSON.stringify(data)); 
    },
    getValue: function(key) { 
      var data = {};
      try {
        data =  JSON.parse(window.localStorage.getItem(APPLICATION.sessionName));
        return data[key];
      } catch (e) {
        console.log('Error to get session data from local storage');
        return null;
      }
      
    },
    remove: function(){
      var data = {};
      window.localStorage.setItem(APPLICATION.sessionName, JSON.stringify(data));
    }
  };
  
  return Session; 
}]);


'use strict';

var utils = angular.module('Utils', []);

/** 
 * Authentication 
 */
utils.factory('Auth', ["Base64", "$http", function (Base64, $http) {
    // initialize to whatever is in the cookie, if anything
    return {
        setCredentials: function (username, password) {
            var encoded = Base64.encode(username + ':' + password);
            $http.defaults.headers.common.Authorization = 'Basic ' + encoded;
        }
    };
}]);

/** 
 * General utility
 */
utils.factory('Utility', function () {
    // initialize to whatever is in the cookie, if anything
    return {
        isUndefinedOrNull: function(obj) {
            return !angular.isDefined(obj) || obj===null;
        }
    };
});

/** 
 * Authentication header creation base64 Algorithm
 */
utils.factory('Base64', function() {
    var keyStr = 'ABCDEFGHIJKLMNOP' +
        'QRSTUVWXYZabcdef' +
        'ghijklmnopqrstuv' +
        'wxyz0123456789+/' +
        '=';
    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
 
            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
 
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
 
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
 
                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);
 
            return output;
        },
 
        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
 
            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));
 
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
 
                output = output + String.fromCharCode(chr1);
 
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
 
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
 
            } while (i < input.length);
 
            return output;
        }
    };
});
'use strict';

var delegatorServices = angular.module('delegatorServices', ['Utils','Constants']);

delegatorServices.factory('Remote', ["$http", "APPLICATION", "Session", function($http, APPLICATION, Session) {
	return {
		setHeader: function(){
			if(Session.getValue(APPLICATION.authToken) != null){
				$http.defaults.headers.common['X-AUTH-TOKEN'] = Session.getValue(APPLICATION.authToken);
			}
		},
	  	get: function(url) {
			console.log('Delegator GET :' + APPLICATION.host + url);
			this.setHeader();
			
		    // com_thisnt below code to check with device id
		  	var promise = $http.get(APPLICATION.host + url, {withCredentials: true} )
		  	.success(function (data, status) {
		  		console.log('Success from server'); 
		 		return data; //this success data will be used in then _thisthod of controller call 
			})
			.error(function (data, status) {
				console.log('Error from server'); 
				return null; //this failure data will be used in then _thisthod of controller call
			});
			
		  	return promise; //return promise object to controller  
	  	},
	  	post: function(url, jsondata) {
	  		console.log('Delegator POST :' + APPLICATION.host + url +" -> JSON DATA : "+ jsondata);
			this.setHeader();
			

	  		var promise = $http.post(APPLICATION.host + url, jsondata, {withCredentials: true})
	  		.success(function (data, status) {
	  			console.log('Success from server'); 
	  			return data;
			})
			.error(function (data, status) {
				console.log('Error from server'); 
				return null;
			});
			
			return promise;
	  	},
	  	put: function(url, jsondata) {
	  		console.log('Delegator PUT :' + APPLICATION.host + url +" -> JSON DATA : "+ jsondata);
	  		this.setHeader();

	  		var promise = $http.put( APPLICATION.host + url, jsondata, {withCredentials: true})
	  		.success(function (data, status) {
	  			console.log('Success from server'); 
	  			return data;
			})
			.error(function (data, status) {
				console.log('Error from server'); 
				return null;
			});
			
			return promise;
	  	},
	  	delete: function(url, jsondata) {
	  		console.log('Delegator DELETE :' + APPLICATION.host + url );
	  		this.setHeader();

		    // com_thisnt below code 
		  	var promise = $http.delete(APPLICATION.host + url, jsondata,  {withCredentials: true})
		  	.success(function (data, status) {
		  		console.log('Success from server'); 
		  		return data; //this success data will be used in then _thisthod of controller call 
			})
			.error(function (data, status) {
				console.log('Error from server'); 
				return null; //this failure data will be used in then _thisthod of controller call
			});
			
		  	return promise; //return promise object to controller  
	  	}
	};
}]);
'use strict';

var userServices = angular.module('userServices', ['delegatorServices']);

userServices.factory('AuthService', ["$http", "$filter", "Remote", "Session", function($http, $filter, Remote, Session) {
    return {
	  	    login: function(url, loginDetails) { 
                console.log('Login service...'); 
                var promise = Remote.post(url, $filter('json')(loginDetails)); 
		  	    return promise;
		  	},
            logout: function(url){
                console.log('Logout service...'); 
                var promise = Remote.delete(url); 
                return promise;
            },
            isAuthenticated: function () {
                return !!Session.getValue(APPLICATION.authToken);
            },
            isAuthorized: function (authorizedRoles) {
                if (!angular.isArray(authorizedRoles)) {
                    authorizedRoles = [authorizedRoles];
                }
                return (this.isAuthenticated() && authorizedRoles.indexOf(Session.getValue(APPLICATION.role)) !== -1);
            }
	}
}]);
'use strict';

var todoService = angular.module('todoService', ['delegatorServices']);

todoService.factory('TodoService', ["$http", "Remote", function($http, Remote) {
    return {
	  	    list: function(url) { 
                console.log('todo List service...'); 
                var promise = Remote.get(url); 
		  	    return promise;
		  	},
            save: function(url, todo){
                console.log('todo save service...'); 
                var promise = Remote.post(url, todo); 
                return promise;
            },
            delete: function(url,todoId){
                console.log('todo delete service...'); 
                var promise = Remote.delete(url +"/" + todoId); 
                return promise;
            } 
	}
}]);
'use strict';
 
// Here we attach this controller to our testApp module
var LoginCtrl =  angular.module('loginController',['userServices','Utils','Constants']);
  
// The controller function let's us give our controller a name: MainCtrl
// We'll then pass an anonymous function to serve as the controller itself.
LoginCtrl.controller('LoginCtrl', ["$scope", "$rootScope", "$location", "Auth", "AuthService", "Utility", "AUTH_EVENTS", "REST_URL", "PAGE_URL", "Session", function ($scope, $rootScope,$location, Auth, AuthService, Utility, AUTH_EVENTS, REST_URL, PAGE_URL, Session) {
  //Authentication controller 
  $scope.authenticate = function(loginDetails){
    console.log('LoginCtrl : authenticate');
    if(!Utility.isUndefinedOrNull(loginDetails)){
      Auth.setCredentials(loginDetails.username, loginDetails.password);
      AuthService.login(REST_URL.AUTHENTICATION).then(function(result){
        console.log('Success : Return from login service.');
        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
        Session.create(result.data.user.token, result.data.user.details.username, result.data.user.details.roles[0]);
        $location.url(PAGE_URL.HOME);
      },function(result){
        $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        console.log('Error : Return from login service.');
      });
    }else{
      $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
    }
  };

  $scope.logout = function(){
   AuthService.logout(REST_URL.AUTHENTICATION).then(function(result){
        Session.remove();
        $location.url(PAGE_URL.ROOT);
      },function(result){
          console.log('Error : Return from logout service.');
      });
  };

}]);
'use strict';
 
  // Here we attach this controller to our testApp module
var TodoCtrl = angular.module('todoController',['todoService','Constants'])
  
TodoCtrl.controller('TodoCtrl', ["$scope", "$rootScope", "$location", "TodoService", "REST_URL", "PAGE_URL", "APPLICATION", "Session", function ($scope, $rootScope, $location, TodoService, REST_URL, PAGE_URL, APPLICATION, Session) {
  $scope.username = Session.getValue(APPLICATION.username);
  $scope.getTodos = function(){
    console.log('TodoCtrl : getTodos');

    TodoService.list(REST_URL.TODO_LIST).then(function(result){
      console.log('Success : Return from todo list service.');
      $scope.todos = result.data.todos;
      $rootScope.todos = $scope.todos;
    },function(result){
      console.log('Error : Return from todo list service.');
    }); 
  };

  $scope.saveTodo = function(todo){
    console.log('TodoCtrl : saveTodo');

    TodoService.save(REST_URL.SAVE_TODO, angular.toJson('{"todo": {"name": "'+todo.name+'"}}')).then(function(result){
      console.log('Success : Return from todo save service.');
      $location.url(PAGE_URL.HOME);
    },function(result){
      console.log('Error : Return from todo save service.');
    }); 
  };

  $scope.deleteTodo = function(todoId){
    console.log('TodoCtrl : deleteTodo');
    
    TodoService.delete(REST_URL.DELETE_TODO, todoId).then(function(result){
      console.log('Success : Return from todo delete service.');
      $location.url(PAGE_URL.HOME);
    },function(result){
      console.log('Error : Return from todo delete service.');
    }); 
  };

  $scope.getTodos();

}]);