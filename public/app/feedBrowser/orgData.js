define(['server'], function(server) {

	var orgData = function(api) {

		return {
			getAll : function() {
				return api.get("orgs");
			},
			getById : function(id) {
				return api.get("orgs/" + id);
			},
			getFeeds : function(orgId) {
				return api.get("orgs/" + orgId + "/feeds");
			},
			addFeed : function(name, orgId) {
				return api.post("orgs/" + orgId + "/feeds", {
					name : name
				});
			}
		};
	}(server);

	return orgData;
})