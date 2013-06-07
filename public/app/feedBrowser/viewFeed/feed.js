define(['feedBrowser/feedData', 'durandal/app'], function(feedData, app) {

	var viewModel = function(data) {

		var name = ko.observable();
		var id = ko.observable();
		var collections = ko.observableArray();

		var loadFeed = function(feedId) {
			return data.getById(feedId).done(function(feed) {
				name(feed.name);
				id(feed._id);

				collections.removeAll();
				_.each(feed.collections || [], function(coll) {
					collections.push(coll);
				});
			});
		};

		var addCollection = function() {
			app.showModal('feedBrowser/createCollection/create').then(function(newCollection) {
				feedData.addCollection(newCollection.name, id()).then(function() {
					loadFeed(id());
				});
			});
		};

		return {
			name : name,
			collections : collections,
			addCollection : addCollection,
			// archiveFeed: function(){
			// data.archive(id()).done(function(){
			// //go back to feed listing
			// alert("need to go back to the feed listing here");
			// });
			// },
			activate : function(args) {
				id(args.id);
				return loadFeed(args.id);
			}
		};
	}(feedData);

	return viewModel;
});
