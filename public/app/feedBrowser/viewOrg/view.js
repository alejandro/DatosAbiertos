define(['feedBrowser/orgData', 'durandal/app'], function(orgData, app) {

	var viewModel = function() {

		var name = ko.observable();
		var id = ko.observable();
		var feeds = ko.observableArray();

		var loadFeeds = function() {
			feeds.removeAll();
			return orgData.getFeeds(id()).done(function(feedsFromServer) {
				_.each(feedsFromServer, function(feed) {
					feeds.push(feed);
				});
			});
		};

		return {
			name: name,
			feeds : feeds,
			createFeed : function() {
				app.showModal('feedBrowser/createFeed/create').then(function(newFeed) {
					orgData.addFeed(newFeed.name, id())
					loadFeeds();
				});
			},
			archive: function(){
				data.archive(id()).done(function(){
					//go back to feed listing
					alert("need to go back to the feed listing here");
				});
			},
			activate : function(args) {			
				return orgData.getById(args.id).done(function(org) {
					name(org.name);
					id(org._id);			
				}).then(function(){
					return loadFeeds();
				});
			}
		};
	}();

	return viewModel;
}); 