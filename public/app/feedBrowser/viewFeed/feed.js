define(['feedBrowser/feedData'], function(feedData) {

	var viewModel = function(data) {

		var name = ko.observable();
		var id = ko.observable();

		return {
			name: name,
			archiveFeed: function(){
				data.archive(id()).done(function(){
					//go back to feed listing
					alert("need to go back to the feed listing here");
				});
			},
			activate : function(args) {
				return data.getById(args.id).done(function(feed) {
					name(feed.name);
					id(feed._id);			
				});
			}
		};
	}(feedData);

	return viewModel;
}); 