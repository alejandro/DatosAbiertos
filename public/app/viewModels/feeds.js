define(['feedData'],function(feedData){
	
	var viewModel = function(data){
		
		var feeds = ko.observableArray();
		
		data.getAll().done(function(feedsFromServer){
			_.each(feedsFromServer, function(feed){
				feeds.push(feed);
			});
		});
		
		return {
			Feeds: feeds	
		};
		
	}(feedData);
	
	return viewModel;
})
