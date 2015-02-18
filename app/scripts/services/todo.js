(function() {
'use strict';
 
angular.module('angularjsApp')
    .factory('TodoService', function(
        $http, 
        $log,
        Remote) {
            return {
    	  	    list: list,
                save: save,
                delete: deletetodo
            };
        
            function list(url) { 
                $log.info('todo List service...'); 
                var promise = Remote.get(url); 
                return promise;
            }
            
            function save(url, todo){
                $log.info('todo save service...'); 
                var promise = Remote.post(url, todo); 
                return promise;
            }
            
            function deletetodo(url,todoId){
                $log.info('todo delete service...'); 
                var promise = Remote.delete(url +"/" + todoId); 
                return promise;
            }  
});
})();
