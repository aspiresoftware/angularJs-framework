'use strict';
 
// Here we attach this controller to our testApp module
var LoginCtrl =  angular.module('loginController',['userServices','Utils','Constants']);
  
// The controller function let's us give our controller a name: MainCtrl
// We'll then pass an anonymous function to serve as the controller itself.
LoginCtrl.controller('LoginCtrl', function ($scope, $rootScope,$location, Auth, AuthService, Utility, AUTH_EVENTS, REST_URL, PAGE_URL, Session) {
  //Authentication controller 
  $scope.authenticate = function(loginDetails){
    console.log('LoginCtrl : authenticate');
    if(!Utility.isUndefinedOrNull(loginDetails)){
      Auth.setCredentials(loginDetails.username, loginDetails.password);
      AuthService.login(REST_URL.AUTHENTICATION).then(function(result){
        console.log('Success : Return from login service.');
        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
        Session.create(result.data.user.token, result.data.user.details.username, result.data.user.details.roles[0]);
        $location.url(PAGE_URL.HOME);
      },function(result){
        $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        console.log('Error : Return from login service.');
      });
    }else{
      $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
    }
  };

  $scope.logout = function(){
   AuthService.logout(REST_URL.AUTHENTICATION).then(function(result){
        Session.remove();
        $location.url(PAGE_URL.ROOT);
      },function(result){
          console.log('Error : Return from logout service.');
      });
  };

});