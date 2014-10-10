'use strict';

var delegatorServices = angular.module('delegatorServices', ['Utils']);

delegatorServices.factory('Remote', function($http, Auth, Utility) {
	return {
		setCredentials: function(){
			//TODO : need to replace username and password
	  		//Auth.setCredentials('username','Password');
	  	},
	  	processResult: function(callback,data){
	  		console.log('Process result...'); 
	  		if(!Utility.isUndefinedOrNull(callback)){
		  		callback(data);
		  	}	
	  	},
		get: function(url, successCallback, failureCallback) {
			console.log('Delegator GET :' + url);
			var me = this;
			me.setCredentials();
		  		
		    // comment below code to check with device id
		  	var promise = $http.get(url)
		  	.success(function (data, status) {
		  		console.log('Success from server'); 
		  		me.processResult(successCallback, data);
		  		return data; //this success data will be used in then method of controller call 
			})
			.error(function (data, status) {
				console.log('Error from server'); 
				me.processResult(failureCallback, data);
				return null; //this failure data will be used in then method of controller call
			});
			
		  	return promise; //return promise object to controller  
	  	},
	  	post: function(url, jsondata, successCallback, failureCallback) {
	  		console.log('Delegator POST :' + url + jsondata);
	  		var me = this; 
			me.setCredentials();
	    			
	  		var promise = $http.post( url, jsondata, { headers: {'Content-Type': 'application/json'} })
	  		.success(function (data, status) {
	  			console.log('Success from server'); 
	  			me.processResult(successCallback, data);
	  			return data;
			})
			.error(function (data, status) {
				console.log('Error from server'); 
				me.processResult(failureCallback, data);
				return null;
			});
			
			return promise;
	  	},
	  	put: function(url, jsondata, successCallback, failureCallback) {
	  		console.log('Delegator PUT :' + url + jsondata); 
	  		var me = this;
			me.setCredentials();

	  		var promise = $http.put( url, jsondata, { headers: {'Content-Type': 'application/json'} })
	  		.success(function (data, status) {
	  			console.log('Success from server'); 
	  			me.processResult(successCallback, data);
	  			return data;
			})
			.error(function (data, status) {
				console.log('Error from server'); 
				me.processResult(failureCallback, data);
				return null;
			});
			
			return promise;
	  	},
	  	delete: function(url, successCallback, failureCallback) {
	  		console.log('Delegator DELETE :' + url + jsondata); 
	  		var me = this;
	  		me.setCredentials();		  			    
		    // comment below code 
		  	var promise = $http.delete(url)
		  	.success(function (data, status) {
		  		console.log('Success from server'); 
		  		me.processResult(successCallback, data);
		  		return data; //this success data will be used in then method of controller call 
			})
			.error(function (data, status) {
				console.log('Error from server'); 
				me.processResult(failureCallback, data);
				return null; //this failure data will be used in then method of controller call
			});
			
		  	return promise; //return promise object to controller  
	  	}
	};
});