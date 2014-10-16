'use strict';
 
  // Here we attach this controller to our testApp module
var ProductCtrl = angular.module('productController',['productService','Constants'])
  
ProductCtrl.controller('ProductCtrl', function ($scope, $rootScope, $location, ProductService, REST_URL) {
  
  $scope.getProducts = function(){
    console.log('ProductCtrl : getProduct');

    ProductService.list(REST_URL.PRODUCT_LIST).then(function(result){
      console.log('Success : Return from product list service.');
      $scope.products = result.data.products;
      $rootScope.products = $scope.products;
    },function(result){
      console.log('Error : Return from product list service.');
    }); 
  };

  $scope.saveProduct = function(product){
    console.log('ProductCtrl : saveProduct');

    ProductService.save(REST_URL.SAVE_PRODUCT, angular.toJson('{"product": {"name": "'+product.name+'","description": "'+product.description+'"},"token": "Session_token_ID"}')).then(function(result){
      console.log('Success : Return from product save service.');
      $location.url('/home');
    },function(result){
      console.log('Error : Return from product save service.');
    }); 
  };

  $scope.deleteProduct = function(productId){
    console.log('ProductCtrl : deleteProduct');
    
    ProductService.delete(REST_URL.DELETE_PRODUCT, productId).then(function(result){
      console.log('Success : Return from product delete service.');
      $location.url('/home');
    },function(result){
      console.log('Error : Return from product delete service.');
    }); 
  };

  $scope.getProducts();

});