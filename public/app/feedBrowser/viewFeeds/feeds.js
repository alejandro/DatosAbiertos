define(['feedBrowser/feedData', 'durandal/app'], function(feedData, app) {

	var viewModel = function(data) {

		var feeds = ko.observableArray();

		var loadFeeds = function() {
			feeds.removeAll();
			return data.getAll().done(function(feedsFromServer) {
				_.each(feedsFromServer, function(feed) {
					feeds.push(feed);
				});
			});
		};

		return {
			feeds : feeds,
			createFeed : function() {
				app.showModal('feedBrowser/createFeed/create').then(function(newFeed) {
					loadFeeds();
				});
			},
			activate : function() {
				return loadFeeds();
			},
			viewAttached : function() {				
			}
		};

	}(feedData);

	return viewModel;
})
