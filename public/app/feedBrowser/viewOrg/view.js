define(['feedBrowser/orgData', 'durandal/app'], function(orgData, app) {

	var viewModel = function() {

		var name = ko.observable();
		var orgId = ko.observable();
		var feeds = ko.observableArray();
		var applications = ko.observableArray();
		var admins = ko.observableArray();

		var loadOrg = function() {
			return orgData.getById(orgId()).done(function(org) {
				name(org.name);
				applications(org.applications);
			});
		};

		var loadFeeds = function() {
			feeds.removeAll();
			return orgData.getFeeds(orgId()).done(function(feedsFromServer) {
				_.each(feedsFromServer, function(feed) {
					feeds.push(feed);
				});
			});
		};

		var loadAdmins = function() {
			admins.removeAll();
			return orgData.getAdmins(orgId()).done(function(adminsFromServer) {
				_.each(adminsFromServer, function(admin) {
					admins.push(admin);
				});
			});
		};

		var addApplication = function() {
			app.showModal('feedBrowser/createApplication/create').then(function(newApp) {
				orgData.addApplication(newApp.name, orgId()).then(loadOrg);
			});
		};

		var addAdmin = function() {
			app.showModal('feedBrowser/addOrgAdmin/add', {
				orgId : orgId()
			}).then(function(newAdmin) {
				orgData.addAdmin(newAdmin._id, orgId()).then(loadAdmins);
			});
		};

		var createFeed = function() {
			app.showModal('feedBrowser/createFeed/create').then(function(newFeed) {
				orgData.addFeed(newFeed.name, orgId()).then(loadFeeds);
			});
		};

		var removeAdmin = function(admin) {
			return orgData.removeAdmin(orgId(), admin._id).done(function() {
				admins.remove(admin);
			});
		};

		return {
			name : name,
			orgId : orgId,
			feeds : feeds,
			addAdmin : addAdmin,
			admins : admins,
			createFeed : createFeed,
			applications : applications,
			addApplication : addApplication,
			removeAdmin : removeAdmin,
			activate : function(args) {
				orgId(args.id);
				return loadOrg().then(loadFeeds).then(loadAdmins);
			}
		};
	}();

	return viewModel;
});
