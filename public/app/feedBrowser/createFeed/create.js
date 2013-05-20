define(['feedBrowser/feedData', 'durandal/app'], function(feedData, app) {

	var viewModel = function() {
		
		var name = ko.observable();
		
		var closeModal = function(){};
		
		var create = function(){
			var newFeed = {name: name()};
			feedData.create(newFeed).then(function(){
				closeModal(newFeed);
			});
		};
		
		return {
			name: name,
			create: create,	
			activate : function() { 
				var self = this;	
				closeModal = function(feed){
					self.modal.close(feed);
				}			
			}
		};

	}();

	return viewModel;
})
