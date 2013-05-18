define(['feedBrowser/feedData', 'durandal/app'], function(feedData, app) {

	var viewModel = function(data) {

		var feeds = ko.observableArray();

		data.getAll().done(function(feedsFromServer) {
			_.each(feedsFromServer, function(feed) {
				feeds.push(feed);
			});
		});

		return {
			feeds : feeds,
			createFeed: function(){				
				app.showModal('feedBrowser/createFeed/create').then(function(newFeed){					
					feeds.push(newFeed);
				});
			},
			activate : function() {
				app.showMessage("Hello world", "Welcome");
			}
		};

	}(feedData);

	return viewModel;
})
