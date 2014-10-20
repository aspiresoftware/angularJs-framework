'use strict';
 
  // Here we attach this controller to our testApp module
var TodoCtrl = angular.module('todoController',['todoService','Constants'])
  
TodoCtrl.controller('TodoCtrl', function ($scope, $rootScope, $location, TodoService, REST_URL, PAGE_URL, APPLICATION, Session) {
  $scope.username = Session.getValue(APPLICATION.username);
  $scope.getTodos = function(){
    console.log('TodoCtrl : getTodos');

    TodoService.list(REST_URL.TODO_LIST).then(function(result){
      console.log('Success : Return from todo list service.');
      $scope.todos = result.data.todos;
      $rootScope.todos = $scope.todos;
    },function(result){
      console.log('Error : Return from todo list service.');
    }); 
  };

  $scope.saveTodo = function(todo){
    console.log('TodoCtrl : saveTodo');

    TodoService.save(REST_URL.SAVE_TODO, angular.toJson('{"todo": {"name": "'+todo.name+'"}}')).then(function(result){
      console.log('Success : Return from todo save service.');
      $location.url(PAGE_URL.HOME);
    },function(result){
      console.log('Error : Return from todo save service.');
    }); 
  };

  $scope.deleteTodo = function(todoId){
    console.log('TodoCtrl : deleteTodo');
    
    TodoService.delete(REST_URL.DELETE_TODO, todoId).then(function(result){
      console.log('Success : Return from todo delete service.');
      $location.url(PAGE_URL.HOME);
    },function(result){
      console.log('Error : Return from todo delete service.');
    }); 
  };

  $scope.getTodos();

});