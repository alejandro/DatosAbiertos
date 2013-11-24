define(['feedBrowser/orgData', 'durandal/app'], function(orgData, app) {

	var viewModel = function() {
		
		var name = ko.observable();
		var code = ko.observable();
		
		var closeModal = function(){};
		
		var create = function(){
			var newOrg = {name: name(), code: code()};
			orgData.create(newOrg).then(function(){
				closeModal(newOrg);
			});
		};
		
		return {
			name: name,
			code: code,
			create: create,	
			activate : function() { 
				var self = this;	
				closeModal = function(org){
					self.modal.close(org);
				}			
			}
		};

	}();

	return viewModel;
})
