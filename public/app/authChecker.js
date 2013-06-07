define(['server'], function(server) {

	var authChecker = function(api) {

		var authenticated = false;

		return {
			check : function() {
				if (authenticated) {
					var def = $.Deferred();
					def.resolve();
					return def.promise();
				} else {
					return api.get("login/check").then(function() {
						authenticated = true;
					});
				}
			},
			authFailed : function() {
				authenticated = false;
				var def = $.Deferred();
				def.resolve();
				return def.promise();
			}
		};
	}(server);

	return authChecker;
})