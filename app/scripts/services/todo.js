'use strict';

var todoService = angular.module('todoService', ['delegatorServices']);

todoService.factory('TodoService', function($http, Remote) {
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
});