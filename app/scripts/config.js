'use strict';


var app = angular.module('Constants', []);

app.constant('APPLICATION', {
    'host' : 'http://192.168.1.20:9000/'
});

app.constant('REST_URL', {
    'AUTHENTICATION': 'authentications',
    'PRODUCT_LIST': 'products',
    'SAVE_PRODUCT': 'products/save',
    'DELETE_PRODUCT': 'products/delete',
});

app.constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
});

app.constant('USER_ROLES', {
  all: '*',
  admin: 'admin',
  user: 'user',
  guest: 'guest'
});