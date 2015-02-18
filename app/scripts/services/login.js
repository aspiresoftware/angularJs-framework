(function() {
'use strict';
 
angular.module('angularjsApp')

  .factory('AuthService', function(
    $http, 
    $filter, 
    $log,
    Remote, 
    Session) {
        return {
      	    login: login,
            logout: logout,
            isAuthenticated: isAuthenticated,
            isAuthorized: isAuthorized
    	};

        function login(url, loginDetails) { 
            $log.info('Login service...'); 
            var promise = Remote.post(url, $filter('json')(loginDetails)); 
            return promise;
        }

        function logout(url){
            $log.info('Logout service...'); 
            var promise = Remote.delete(url); 
            return promise;
        }

        function isAuthenticated() {
            return !!Session.getValue(APPLICATION.authToken);
        }

        function isAuthorized(authorizedRoles) {
            if (!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
            }
            return (isAuthenticated() && authorizedRoles.indexOf(Session.getValue(APPLICATION.role)) !== -1);
        }
});
})();