define(['feedBrowser/orgData', 'durandal/app'], function(orgData, app) {

	var viewModel = function() {
		
		var code = ko.observable();
		
		var closeModal = function(){};
		
		var change = function(){
			closeModal(code());
		};
		
		return {
			code: code,
			change: change,	
			activate : function(c) { 
				var self = this;	
				code(c);
				closeModal = function(code){
					self.modal.close(code);
				}			
			}
		};

	}();

	return viewModel;
})
