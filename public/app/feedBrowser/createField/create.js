define(function() {

	var viewModel = function() {
		
		var name = ko.observable();
		
		var closeModal = function(){};
		
		var create = function(){
			var newItem = {name: name()};
			closeModal(newItem);
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
