define(function() {

	var viewModel = function() {
		
		var name = ko.observable();
		var username = ko.observable();
		var password = ko.observable();
		var passwordConfirm = ko.observable();
		var email = ko.observable();
		
		var closeModal = function(){};
		
		var create = function(){
			var newUser = {name: name(), username: username(), password: password(), email: email()};
			closeModal(newUser);
		};
		
		return {
			name: name,
			username: username,
			password: password,
			passwordConfirm: passwordConfirm,
			email: email,
			create: create,	
			activate : function() { 
				var self = this;	
				closeModal = function(newUser){
					self.modal.close(newUser);
				}			
			}
		};

	}();

	return viewModel;
})
