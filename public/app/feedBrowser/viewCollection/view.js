'use strict';

define(['underscore', 'feedBrowser/feedData', 'durandal/app'], function(_, feedData, app) {

	var viewModel = function(data) {

		var name = ko.observable();
		var orgCode = ko.observable();
		var collectionCode = ko.observable();
		var fields = ko.observableArray();

		var feedId = ko.observable();
		var collectionId = ko.observable();

		var loadCollection = function() {
			return data.getById(feedId()).done(function(feed) {
				name(feed.name);
				orgCode(feed.org.code);
				
				var collection = _.find(feed.collections, function(c) {
					return c._id == collectionId();
				});
				fields.removeAll();

				collectionCode(collection.code);

				_.each(collection.fields || [], function(field) {
					fields.push(field);
				});
			});
		};

		var addField = function() {
			app.showModal('feedBrowser/createField/create').then(function(newField) {
				var rules = [];
				feedData.addField(newField.name, newField.dataType, rules, feedId(), collectionId()).then(function() {
					loadCollection();
				});
			});
		};

		return {
			name: name,
			orgCode: orgCode,
			collectionCode: collectionCode,
			fields: fields,
			addField: addField,
			feedId: feedId,
			collectionId: collectionId,
			activate: function(args) {
				feedId(args.feedId);
				collectionId(args.collectionId);
				return loadCollection();
			}
		};
	}(feedData);

	return viewModel;
});