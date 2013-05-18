define(['feedBrowser/feedData', 'durandal/app'], function(feedData, app) {

	var viewModel = function() {

		var name = ko.observable();
		
		var create = function(){
			var newFeed = {name: name()};
			feedData.create(newFeed).then(function(){
				this.modal.close(newFeed);
			});
		};
		
		return {
			name: name,
			create: create,	
			activate : function() {

			}
		};

	}();

	return viewModel;
})
