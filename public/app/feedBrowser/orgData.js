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
			create : function(org) {
				return api.post("orgs", org);
			},
			addFeed : function(name, orgId) {
				return api.post("orgs/" + orgId + "/feeds", {
					name : name
				});
			},
			addAdmin : function(newAdminId, orgId) {
				return api.post("orgs/" + orgId + "/admins", {
					userId : newAdminId
				});
			},
			removeAdmin : function(orgId, adminId) {
				return api.delete("orgs/" + orgId + "/admins/" + adminId);
			},
			getApplications : function(orgId) {
				return api.get("orgs/" + orgId + "/applications");
			},
			addApplication : function(name, orgId) {
				return api.post("orgs/" + orgId + "/applications", {
					name : name
				});
			},
			getAdmins : function(orgId) {
				return api.get("orgs/" + orgId + "/admins");
			}			
		};
	}(server);

	return orgData;
})