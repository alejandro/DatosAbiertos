define(function() {

	var viewModel = function() {
		
		var name = ko.observable();
		
		var closeModal = function(){};
		
		var create = function(){
			var newCollection = {name: name()};
			closeModal(newCollection);
		};
		
		return {
			name: name,
			create: create,	
			activate : function() { 
				var self = this;	
				closeModal = function(newCollection){
					self.modal.close(newCollection);
				}			
			}
		};

	}();

	return viewModel;
})
