'use strict';

define(function() {

	var viewModel = function() {
		
		var name = ko.observable();
		var code = ko.observable();
		
		var closeModal = function(){};
		
		var create = function(){
			var newCollection = {name: name(), code: code()};
			closeModal(newCollection);
		};
		
		return {
			name: name,
			code: code,
			create: create,
			activate : function() {
				var self = this;
				closeModal = function(newCollection){
					self.modal.close(newCollection);
				};
			}
		};
	}();

	return viewModel;
});