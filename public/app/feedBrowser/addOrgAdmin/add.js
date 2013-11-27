define(['feedBrowser/accountData', 'durandal/app'], function(accountData, app) {

	var viewModel = function() {
		
		var emailAddress = ko.observable();
		var orgId = ko.observable();
		var users = ko.observableArray();
		
		var closeModal = function(){};
		
		var search = function(){
			accountData.search(emailAddress()).then(function(accountsFromServer){
				users(accountsFromServer);
			});	
		};
		
		var add = function(userToAdd){
			closeModal(userToAdd);
		};
		
		return {
			emailAddress: emailAddress,
			users: users,
			search: search,
			add: add,	
			activate : function(org) { 
				orgId(org.orgId);
				users([]);
				emailAddress("");
				var self = this;	
				closeModal = function(user){
					self.modal.close(user);
				}			
			}
		};

	}();

	return viewModel;
})
