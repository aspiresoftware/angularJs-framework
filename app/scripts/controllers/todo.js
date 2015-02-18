(function() {
'use strict';
 
angular.module('angularjsApp')
 
  // Here we attach this controller to our testApp module

  /* @ngInject */
  .controller('TodoCtrl', function (
    $scope, 
    $rootScope, 
    $location,
    $log, 
    TodoService, 
    REST_URL, 
    PAGE_URL, 
    APPLICATION, 
    Session) {
  
    $scope.username = Session.getValue(APPLICATION.username);
    $scope.getTodos = getTodos;
    $scope.saveTodo = saveTodo;
    $scope.deleteTodo = deleteTodo;

    function getTodos(){
      $log.info('TodoCtrl : getTodos');

      TodoService.list(REST_URL.TODO_LIST).then(function(result){
        $log.info('Success : Return from todo list service.');
        $scope.todos = result.data.todos;
        $rootScope.todos = $scope.todos;
      },function(result){
        $log.error('Error : Return from todo list service.');
      }); 
    }

    function saveTodo(todo){
      $log.info('TodoCtrl : saveTodo');

      TodoService.save(REST_URL.SAVE_TODO, angular.toJson('{"todo": {"name": "'+todo.name+'"}}')).then(function(result){
        $log.info('Success : Return from todo save service.');
        $location.url(PAGE_URL.HOME);
      },function(result){
        $log.error('Error : Return from todo save service.');
      }); 
    }

    function deleteTodo(todoId){
      $log.info('TodoCtrl : deleteTodo');
      
      TodoService.delete(REST_URL.DELETE_TODO, todoId).then(function(result){
        $log.info('Success : Return from todo delete service.');
        $location.url(PAGE_URL.HOME);
      },function(result){
        $log.error('Error : Return from todo delete service.');
      }); 
    }

    $scope.getTodos();

});
})();
