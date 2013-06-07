define(['server'], function(server) {

	var feedData = function(api) {

		return {
			getAll : function() {
				return api.get("feeds");
			},
			getById : function(id) {
				return api.get("feeds/" + id);
			},
			addCollection : function(name, feedId) {
				return api.post("feeds/" + feedId + "/collections", {
					name : name
				});
			},
		};
	}(server);

	return feedData;
})