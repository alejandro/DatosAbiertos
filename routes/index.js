var routes = function() {

	var feeds = require("./feeds");
	var login = require("./login");

	return {
		init : function(app) {
			console.log("Initializing feed routes...");
			feeds.init(app);
			console.log("Initializing login routes...");
			login.init(app);
		},
		feeds : feeds,
		login : login
	}
}();

module.exports = routes;
