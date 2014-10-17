'use strict';
 
// Here we attach this controller to our testApp module
var LoginCtrl =  angular.module('loginController',['userServices','Utils','Constants']);
  
// The controller function let's us give our controller a name: MainCtrl
// We'll then pass an anonymous function to serve as the controller itself.
LoginCtrl.controller('LoginCtrl', function ($scope, $rootScope,$location, LoginService, Utility, AUTH_EVENTS, REST_URL, Session) {
  //Authentication controller 
  $scope.authenticate = function(loginDetails){
    console.log('LoginCtrl : authenticate');
    if(!Utility.isUndefinedOrNull(loginDetails)){
      $rootScope.username = loginDetails.username;
      $rootScope.password = loginDetails.password;
      LoginService.login(REST_URL.AUTHENTICATION).then(function(result){
        console.log('Success : Return from login service.');

        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
        Session.create(result.data.token, result.data.user.userName, result.data.user.details.roles[0]);
        $location.url('/home');
      },function(result){
        $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        console.log('Error : Return from login service.');
      });
    }else{
      $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
    }

  };
});