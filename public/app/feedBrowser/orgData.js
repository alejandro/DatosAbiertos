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
			create: function(org){
				return api.post("orgs", org);
			},
			addFeed : function(name, orgId) {
				return api.post("orgs/" + orgId + "/feeds", {
					name : name
				});
			},
			getApplications : function(orgId) {
				return api.get("orgs/" + orgId + "/applications");
			},
			addApplication : function(name, orgId) {
				return api.post("orgs/" + orgId + "/applications", {
					name : name
				});
			}
		};
	}(server);

	return orgData;
})