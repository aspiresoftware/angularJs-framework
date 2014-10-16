'use strict';

var productService = angular.module('productService', ['delegatorServices']);

productService.factory('ProductService', function($http, Remote) {
    return {
	  	    list: function(url) { 
                console.log('Product List service...'); 
                var promise = Remote.get(url); 
		  	    return promise;
		  	},
            save: function(url, product){
                console.log('Product save service...'); 
                var promise = Remote.post(url, product); 
                return promise;
            },
            delete: function(url,productId){
                console.log('Product delete service...'); 
                var promise = Remote.delete(url +"/" + productId); 
                return promise;
            } 
	}
});