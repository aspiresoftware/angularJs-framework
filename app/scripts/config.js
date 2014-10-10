'use strict';

var CONFIG = (function() {
	var host = {
        'name': 'http://192.168.1.20:9000/'
    };
    var restURL = {
        'LOGIN': '',
        'LOGOUT': '',
        'PRODUCT_LIST': 'products',
        'ADD_PRODUCT': '',
        'EDIT_PRODUCT': '',
        'DELETE_PRODUCT': '',
    };

    return {
        getServiceURL: function(name) { return host.name+restURL[name]; }
	};
})();