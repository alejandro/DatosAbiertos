define(['feedBrowser/applicationData', 'durandal/app'], function(applicationData, app) {

	var name = ko.observable();
	var username = ko.observable();
	var email = ko.observable();
	var saved = ko.observable(false);
	var orgId = ko.observable();
	var appId = ko.observable();
	var userId = ko.observable();

	var loadUser = function() {
		return applicationData.getUser(orgId(), appId(), userId()).done(function(user) {
			name(user.name);
			username(user.username);
			email(user.email);
		});
	};

	var modify = function() {
		return applicationData.modifyUser(orgId(), appId(), userId(), name(), username(), email()).then(function() {
			saved(true);
		});
	};

	return {
		saved : saved,
		name : name,
		username : username,
		email : email,
		save : modify,
		activate : function(args) {
			orgId(args.orgId);
			appId(args.appId);
			userId(args.userId);
			saved(false);
			return loadUser();
		}
	};
});
