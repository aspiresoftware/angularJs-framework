(function() {
'use strict';
 
angular.module('angularjsApp')
.factory('Remote', function(
	$http,
	$log,
	APPLICATION, 
	Session) {
		return {
			setHeader: setHeader,
			get: get,
			post: post,
			put: put,
			delete: deletereq
		};

		function setHeader(){
			if(Session.getValue(APPLICATION.authToken) != null){
				$http.defaults.headers.common['X-AUTH-TOKEN'] = Session.getValue(APPLICATION.authToken);
			}
		}

	  	function get(url) {
			$log.info('Delegator GET :' + APPLICATION.host + url);
			this.setHeader();
			
		    // com_thisnt below code to check with device id
		  	var promise = $http.get(APPLICATION.host + url, {withCredentials: true} )
		  	.success(function (data, status) {
		  		$log.info('Success from server'); 
		 		return data; //this success data will be used in then _thisthod of controller call 
			})
			.error(function (data, status) {
				$log.error('Error from server'); 
				return null; //this failure data will be used in then _thisthod of controller call
			});
			
		  	return promise; //return promise object to controller  
	  	}

	  	function post(url, jsondata) {
	  		$log.info('Delegator POST :' + APPLICATION.host + url +" -> JSON DATA : "+ jsondata);
			setHeader();
			

	  		var promise = $http.post(APPLICATION.host + url, jsondata, {withCredentials: true})
	  		.success(function (data, status) {
	  			$log.info('Success from server'); 
	  			return data;
			})
			.error(function (data, status) {
				$log.error('Error from server'); 
				return null;
			});
			
			return promise;
	  	}

	  	function put(url, jsondata) {
	  		$log.info('Delegator PUT :' + APPLICATION.host + url +" -> JSON DATA : "+ jsondata);
	  		setHeader();

	  		var promise = $http.put( APPLICATION.host + url, jsondata, {withCredentials: true})
	  		.success(function (data, status) {
	  			$log.info('Success from server'); 
	  			return data;
			})
			.error(function (data, status) {
				$log.error('Error from server'); 
				return null;
			});
			
			return promise;
	  	}

	  	function deletereq(url, jsondata) {
	  		$log.info('Delegator DELETE :' + APPLICATION.host + url );
	  		setHeader();

		    // com_thisnt below code 
		  	var promise = $http.delete(APPLICATION.host + url, jsondata,  {withCredentials: true})
		  	.success(function (data, status) {
		  		$log.info('Success from server'); 
		  		return data; //this success data will be used in then _thisthod of controller call 
			})
			.error(function (data, status) {
				$log.errors('Error from server'); 
				return null; //this failure data will be used in then _thisthod of controller call
			});
			
		  	return promise; //return promise object to controller  
	  	}
	});
})();