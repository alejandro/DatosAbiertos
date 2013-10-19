define(['server', 'underscore'], function(server) {

	var module = function(api) {

		return {
			// getAll : function() {
			// return api.get("applications");
			// },
			getUser : function(orgId, appId, userId) {
				return api.get("orgs/" + orgId).then(function(org) {
					var app = _.find(org.applications, function(a) {
						return a._id == appId
					});
					var user = _.find(app.users, function(u) {
						return u._id == userId
					});
					return user;
				});
			},
			modifyUser: function(orgId, appId, userId, name, username, email) {
				return api.put("orgs/" + orgId + "/applications/" + appId + "/users/" + userId, {
					name : name,
					username : username,
					email : email
				});
			},
			getById : function(orgId, appId) {
				return api.get("orgs/" + orgId).then(function(org) {
					return _.find(org.applications, function(a) {
						return a._id == appId
					});
				});
			},
			addUser : function(orgId, applicationId, name, username, password, email) {
				return api.post("orgs/" + orgId + "/applications/" + applicationId + "/users/", {
					name : name,
					username : username,
					password : password,
					email : email
				});
			}
		};
	}(server);

	return module;
})