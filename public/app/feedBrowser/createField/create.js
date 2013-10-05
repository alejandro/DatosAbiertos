define(function() {

	var viewModel = function() {
		
		var name = ko.observable();
		var selectedDataType = ko.observable();
		
		var closeModal = function(){};
		
		var create = function(){
			var newItem = {name: name(), dataType: selectedDataType()};
			closeModal(newItem);
		};
		
		return {
			name: name,			
			selectedDataType : selectedDataType,
			dataTypes : ['text', 'number', 'date'],		
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
