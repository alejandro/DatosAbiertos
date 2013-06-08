define(function(){
		
	var config = function(){
		
		//only one shared url right now
		var url = 'http://localhost:3000/';
		//var url = 'http://datosabiertoshn.aws.af.cm/';
		
		return {
			apiBaseUrl : url,
			loginPage: "/#/login"
		};
	}();
	
	return config;
});
