'use strict';

var delegatorServices = angular.module('delegatorServices', ['Utils','Constants','ngCookies']);

delegatorServices.factory('Remote', function($http, $cookies, $rootScope, Auth, Utility, APPLICATION,Session) {
	return {
	  	get: function(url) {
			console.log('Delegator GET :' + APPLICATION.host + url);
			$http.defaults.headers.common['X-AUTH-TOKEN'] = $cookies.authToken;
		  
		    // com_thisnt below code to check with device id
		  	var promise = $http.get(APPLICATION.host + url, {withCredentials: true})
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
});