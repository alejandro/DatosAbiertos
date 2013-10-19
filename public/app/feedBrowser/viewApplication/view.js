define(['feedBrowser/applicationData', 'durandal/app'], function(appData, app) {

	var viewModel = function(data) {

		var name = ko.observable();
		var users = ko.observableArray();

		var appId = ko.observable();
		var orgId = ko.observable();
		
		var loadUsers = function() {
			return data.getById(orgId(), appId()).done(function(app) {
				name(app.name);
				users(app.users);
			});
		};

		var addUser = function() {
			app.showModal('feedBrowser/createApplicationUser/create').then(function(newUser) {
				data.addUser(orgId(), appId(), newUser.name, newUser.username, newUser.password, newUser.email).then(function() {
					loadUsers();
				});
			});
		};

		return {
			name : name,
			users : users,
			addUser : addUser,
			appId : appId,
			orgId : orgId,
			activate : function(args) {
				orgId(args.orgId);
				appId(args.appId);
				return loadUsers();
			}
		};
	}(appData);

	return viewModel;
});
