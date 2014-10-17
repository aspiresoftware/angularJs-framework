'use strict';

var delegatorServices = angular.module('delegatorServices', ['Utils','Constants','ngCookies']);

delegatorServices.factory('Remote', function($http, $cookieStore, $rootScope, Auth, Utility, APPLICATION,Session) {
	return {
		setCredentials: function(){
	  		Auth.setCredentials($rootScope.username, $rootScope.password);
	  	},
	  	get: function(url) {
			console.log('Delegator GET :' + APPLICATION.host + url);
			var _this = this;
			_this.setCredentials();
		  		
		    // com_thisnt below code to check with device id
		  	var promise = $http.get(APPLICATION.host + url, {withCredentials: true,  headers: {'Content-Type': 'application/json', 'X-AUTH-TOKEN': Session.id} })
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
	  		var _this = this; 
			_this.setCredentials();
	    			
	  		var promise = $http.post(APPLICATION.host + url, jsondata, {withCredentials: true,  headers: {'Content-Type': 'application/json'} })
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
	  		var _this = this;
			_this.setCredentials();

	  		var promise = $http.put( APPLICATION.host + url, jsondata, {withCredentials: true, headers: {'Content-Type': 'application/json'} })
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
	  		var _this = this;
	  		_this.setCredentials();		  			    
		    // com_thisnt below code 
		  	var promise = $http.delete(APPLICATION.host + url, jsondata,  {withCredentials: true, headers: {'Content-Type': 'application/json'} })
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
/*
$provide.factory('HttpInterceptor', function($q, $rootScope) {
    return function(promise) {
        return promise.then(function(response) {
            $rootScope.error="";
            $rootScope.message="test msg";
        }, function(response) {
            $rootScope.error="test err";
            $rootScope.message="";
            if (canRecover(response)) {
                return responseOrNewPromise; // This can suppress the error.
            }
            return $q.reject(response); // This propogates it.
        });
    }
});

$httpProvider.interceptors.push('HttpInterceptor');*/