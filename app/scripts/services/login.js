'use strict';

var userServices = angular.module('userServices', ['delegatorServices']);

userServices.factory('Login', function($http, Remote) {
    return {
	  	    login: function(url) { 
                console.log('Login service...'); 
                var promise = Remote.get(url); 
		  	    return promise;
		  	},
            logout: function(url){
                console.log('Logout service...'); 
                var promise = Remote.delete(url); 
                return promise;
            } 
	}
});