'use strict';

define(['feedBrowser/feedData'], function(feedData) {

	var viewModel = function() {

		var code = ko.observable();
		var codeExists = ko.observable(false);
		var feedId = ko.observable();
		var collectionId = ko.observable();

		var closeModal = function() {};

		var change = function() {
			codeExists(false);
			feedData.getCollectionByCode(feedId(), code()).then(function(collection) {
				if (collection._id == collectionId())
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
				feedId(org.feedId);
				collectionId(org.collectionId);
				closeModal = function(code) {
					self.modal.close(code);
				};
			}
		};

	}();

	return viewModel;
});