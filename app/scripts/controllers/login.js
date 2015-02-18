(function() {
'use strict';
 
angular.module('angularjsApp')
// The controller function let's us give our controller a name: MainCtrl
// We'll then pass an anonymous function to serve as the controller itself.

/* @ngInject */
.controller('LoginCtrl', function (
  $scope, 
  $rootScope,
  $location,
  $log ,
  Auth, 
  AuthService, 
  Utility, 
  AUTH_EVENTS, 
  REST_URL, 
  PAGE_URL,
  Session) {
    //Authentication controller 
    $scope.authenticate = authenticate;
    $scope.logout = logout;

    function authenticate(loginDetails){
      $log.info('LoginCtrl : authenticate');
      if(!Utility.isUndefinedOrNull(loginDetails)){
        Auth.setCredentials(loginDetails.username, loginDetails.password);
        AuthService.login(REST_URL.AUTHENTICATION).then(function(result){
          $log.info('Success : Return from login service.');
          $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
          Session.create(result.data.user.token, result.data.user.details.username, result.data.user.details.roles[0]);
          $location.url(PAGE_URL.HOME);
        },function(result){
          $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
          $log.error('Error : Return from login service.');
        });
      }else{
        $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
      }
    }

    function logout(){
     AuthService.logout(REST_URL.AUTHENTICATION).then(function(result){
          Session.remove();
          $location.url(PAGE_URL.ROOT);
        },function(result){
            $log.error('Error : Return from logout service.');
        });
    }
  });
})();
