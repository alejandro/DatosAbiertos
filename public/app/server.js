define(['config', 'durandal/plugins/router'],function(config, router){
		
	var server = function(){
	
		var get = function (resource, data) {
            return sendAjaxRequest("GET", resource, data);
        };

        var post = function (resource, data) {
            return sendAjaxRequest("POST", resource, data);
        };

        var put = function (resource, data) {
            return sendAjaxRequest("PUT", resource, data);
        };

        var del = function (resource, data) {
            return sendAjaxRequest("DELETE", resource, data);
        };

        var sendAjaxRequest = function (type, resource, data) {
            
            var operator = "?";
            if (resource.indexOf("?") !== -1) {
                operator = "&";
            }

            var fullUrl = config.apiBaseUrl + resource + operator;

            //append timestamp so browsers won't cache requests
            fullUrl = fullUrl + "&_ts=" + new Date().getTime();

            var promise = $.ajax({
                url: fullUrl,
                type: type,
                data: data
            });

			promise.fail(function(err){
				if(err.status == 401){
					console.log("Got a 401... redirecting to the login page.");
					return require('authChecker').authFailed().done(function(){
						//router.navigateToRoute(config.loginPage);	
					});					
				}	
				return err;
			});
			
            //error handling
            promise.then(function (response, textStatus, jqXhr) {
                if (response && response.Status == "error") {
                    if (console) {
                        console.log(response.Message);
                    } else {
                        alert(response.Message);
                    }

                    var deferred = new $.Deferred();
                    return deferred.reject(response);
                }
                return jqXhr;
            });

            return promise;
            	                   
        };

		return {
			get: get,
			post: post,
			delete: del,
			put: put
		};
		
	}();
	
	return server;
});
