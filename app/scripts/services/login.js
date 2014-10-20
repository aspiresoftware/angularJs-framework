'use strict';

var userServices = angular.module('userServices', ['delegatorServices']);

userServices.factory('AuthService', function($http, $filter, Remote, Session) {
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
});