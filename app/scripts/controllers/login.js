'use strict';
 
// Here we attach this controller to our testApp module
var LoginCtrl =  angular.module('loginController',['userServices']);
  
// The controller function let's us give our controller a name: MainCtrl
// We'll then pass an anonymous function to serve as the controller itself.
LoginCtrl.controller('LoginCtrl', function ($scope, $rootScope, $location,Login) {
  $scope.productList;
  //Authentication controller 
  $scope.authenticate = function(loginDetails){
    console.log('LoginCtrl : authenticate');

    Login.login(CONFIG.getServiceURL('PRODUCT_LIST')).then(function(result){
      console.log('Success : Return from login service.');
      $scope.productList = result.data.products;
      $rootScope.productList = $scope.productList;
      $location.url('/home');
    },function(result){
      console.log('Error : Return from login service.');
    });
    
    
  };
});