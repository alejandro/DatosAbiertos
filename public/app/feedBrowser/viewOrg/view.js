define(['feedBrowser/orgData', 'durandal/app'], function(orgData, app) {

	var viewModel = function() {

		var name = ko.observable();
		var orgId = ko.observable();
		var feeds = ko.observableArray();
		var applications = ko.observableArray();

		var loadOrg = function(){
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

		var addApplication = function() {
			app.showModal('feedBrowser/createApplication/create').then(function(newApp) {
				orgData.addApplication(newApp.name, orgId())
				loadOrg();
			});
		};
			
		return {
			name : name,
			orgId: orgId,
			feeds : feeds,
			createFeed : function() {
				app.showModal('feedBrowser/createFeed/create').then(function(newFeed) {
					orgData.addFeed(newFeed.name, orgId())
					loadFeeds();
				});
			},
			applications : applications,
			addApplication : addApplication,
			activate : function(args) {
				orgId(args.id);
				return loadOrg().then(loadFeeds);
			}
		};
	}();

	return viewModel;
});
