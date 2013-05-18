define(['feedBrowser/feedData'], function(feedData) {

	var viewModel = function(data) {

		var name = ko.observable();

		return {
			activate : function(args) {
				return data.getById(args.id).done(function(feed) {
					name(feed.name);			
				});
			}
		};
	}(feedData);

	return viewModel;
}); 