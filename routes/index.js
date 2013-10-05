var routes = function() {

	var feeds = require("./feeds");
	var orgs = require("./orgs");
	var data = require("./data");
	var login = require("./login");

	return {
		init : function(app) {
			
			console.log("Initializing feeds routes...");
			feeds.init(app);
			
			console.log("Initializing orgs routes...");
			orgs.init(app);
			
			console.log("Initializing login routes...");
			login.init(app);
			
			console.log("Initializing data routes...");
			data.init(app);
			
		},
		feeds : feeds,
		orgs : orgs,
		login : login,
		data: data
	}
}();

module.exports = routes;
