'use strict';

define(['feedBrowser/orgData'], function(orgData) {

	var viewModel = function() {

		var code = ko.observable();
		var codeExists = ko.observable(false);
		var orgId = ko.observable();

		var closeModal = function() {};

		var change = function() {
			codeExists(false);
			orgData.getByCode(code()).then(function(org) {
				if (org._id == orgId())
					closeModal(code());
				else
					codeExists(true);
			}).fail(function() {
				closeModal(code());
			});
		};

		return {
			code: code,
			codeExists: codeExists,
			change: change,
			activate: function(org) {
				var self = this;
				code(org.code);
				orgId(org.orgId);
				closeModal = function(code) {
					self.modal.close(code);
				};
			}
		};

	}();

	return viewModel;
});