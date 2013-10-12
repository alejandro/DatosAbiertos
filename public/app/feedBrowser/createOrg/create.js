define(['feedBrowser/orgData', 'durandal/app'], function(orgData, app) {

	var viewModel = function() {
		
		var name = ko.observable();
		
		var closeModal = function(){};
		
		var create = function(){
			var newOrg = {name: name()};
			orgData.add(newOrg).then(function(){
				closeModal(newOrg);
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
