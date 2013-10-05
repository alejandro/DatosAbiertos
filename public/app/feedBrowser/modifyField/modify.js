define(['feedBrowser/feedData', 'durandal/app'], function(feedData, app) {

	var name = ko.observable();
	var selectedDataType = ko.observable();
	var saved = ko.observable(false);
	var fieldId = ko.observable();
	var feedId = ko.observable();
	var collectionId = ko.observable();

	var loadField = function(feedId, collectionId, fieldId) {
		return feedData.getById(feedId).done(function(feed) {
			name(feed.name);

			var collection = _.find(feed.collections, function(c) {
				return c._id == collectionId
			});

			var field = _.find(collection.fields, function(f) {
				return f._id == fieldId;
			});

			name(field.name);
			selectedDataType(field.dataType);
		});
	};

	return {
		saved: saved,
		name : name,
		selectedDataType : selectedDataType,
		dataTypes : ['text', 'number', 'date'],
		save : function() {
			feedData.modifyField(name(), selectedDataType(), feedId(), collectionId(), fieldId()).then(function() {
				saved(true);
			});
		},
		activate : function(args) {
			fieldId(args.fieldId);
			feedId(args.feedId);
			collectionId(args.collectionId);
			saved(false);
			return loadField(args.feedId, args.collectionId, args.fieldId);
		}
	};
}); 