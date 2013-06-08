define(function() {

	var viewModel = function() {
		
		var name = ko.observable();
		
		var closeModal = function(){};
		
		var create = function(){
			var item = {name: name()};
			closeModal(item);
		};
		
		return {
			name: name,
			create: create,	
			activate : function() { 
				var self = this;	
				closeModal = function(item){
					self.modal.close(item);
				}			
			}
		};

	}();

	return viewModel;
})
