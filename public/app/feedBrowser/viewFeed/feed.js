'use strict';

define(['underscore', 'feedBrowser/feedData', 'durandal/app'], function(_, feedData, app) {

	var viewModel = function(data) {

		var feedId = ko.observable();
		var name = ko.observable();
		var collections = ko.observableArray();

		var loadFeed = function() {
			return data.getById(feedId()).done(function(feed) {
				name(feed.name);

				collections.removeAll();
				_.each(feed.collections || [], function(coll) {
					collections.push(coll);
				});
			});
		};

		var addCollection = function() {
			app.showModal('feedBrowser/createCollection/create').then(function(newCollection) {
				feedData.addCollection(feedId(), newCollection.name, newCollection.code).then(function() {
					loadFeed();
				});
			});
		};

		return {
			name : name,
			collections : collections,
			addCollection : addCollection,
			feedId : feedId,
			activate : function(args) {
				feedId(args.feedId);
				return loadFeed();
			}
		};
	}(feedData);

	return viewModel;
});
