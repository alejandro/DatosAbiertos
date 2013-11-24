define(['feedBrowser/orgData', 'durandal/app'], function(orgData, app) {

	var viewModel = function() {

		var name = ko.observable();
		var code = ko.observable();
		var codeExists = ko.observable(false);

		var closeModal = function() {
		};

		var create = function() {
			orgData.getByCode(code()).then(function(org) {
				codeExists(true);
			}).fail(function(err) {
				var newOrg = {
					name : name(),
					code : code()
				};
				orgData.create(newOrg).then(function() {
					closeModal(newOrg);
				});
			});
		};

		return {
			name : name,
			code : code,
			codeExists : codeExists,
			create : create,
			activate : function() {
				var self = this;
				closeModal = function(org) {
					self.modal.close(org);
				}
			}
		};

	}();

	return viewModel;
})
