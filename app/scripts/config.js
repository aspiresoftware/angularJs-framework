(function() {
'use strict';
 angular.module('angularjsApp')

    .constant('APPLICATION', {
        'host' : 'HOST',
        'sessionName': 'ang_session',
        'authToken': 'token',
        'username' : 'username',
        'role' : 'role'
    })

    .constant('REST_URL', {
        'AUTHENTICATION': 'authentication',
        'TODO_LIST': 'todos',
        'SAVE_TODO': 'todo/save',
        'DELETE_TODO': 'todo/delete',
    })

    .constant('PAGE_URL', {
        'ROOT': '/',
        'HOME': '/home',
    })

    .constant('AUTH_EVENTS', {
      loginSuccess: 'auth-login-success',
      loginFailed: 'auth-login-failed',
      logoutSuccess: 'auth-logout-success',
      sessionTimeout: 'auth-session-timeout',
      notAuthenticated: 'auth-not-authenticated',
      notAuthorized: 'auth-not-authorized'
    })

    .constant('USER_ROLES', {
      all: '*',
      admin: 'admin',
      user: 'user',
      guest: 'guest'
    });
})();