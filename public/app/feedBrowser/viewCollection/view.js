define(['feedBrowser/feedData', 'durandal/app'], function(feedData, app) {

	var viewModel = function(data) {

		var name = ko.observable();
		var fields = ko.observableArray();

		var feedId = ko.observable();
		var collectionId = ko.observable();

		var loadFields = function() {
			return data.getById(feedId()).done(function(feed) {
				name(feed.name);

				var collection = _.find(feed.collections, function(c) {
					return c._id == collectionId()
				});
				fields.removeAll();
				_.each(collection.fields || [], function(field) {
					fields.push(field);
				});
			});
		};

		var addField = function() {
			app.showModal('feedBrowser/createField/create').then(function(newField) {
				feedData.addField(newField.name, feedId(), collectionId()).then(function() {
					loadFields();
				});
			});
		};

		return {
			name : name,
			fields : fields,
			addField : addField,
			feedId : feedId,
			collectionId : collectionId,
			activate : function(args) {
				feedId(args.feedId);
				collectionId(args.collectionId);
				return loadFields();
			}
		};
	}(feedData);

	return viewModel;
});
