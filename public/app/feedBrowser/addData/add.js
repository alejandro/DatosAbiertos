define(['feedBrowser/feedData', 'durandal/app'], function(feedData, app) {

	var viewModel = function(api) {

		var feedId = ko.observable();
		var collectionId = ko.observable();

		var collectionName = ko.observable();
		var fields = ko.observableArray([]);

		var closeModal = function() {
		};

		var add = function() {
			var dataObject = {};
			_.each(fields(), function(field) {
				dataObject[field.name] = field.value;
			});
			closeModal(dataObject);
		};

		var loadCollection = function() {
			return api.getById(feedId()).done(function(feed) {

				var collection = _.find(feed.collections, function(c) {
					return c._id == collectionId()
				});

				collectionName(collection.name);

				var fieldsArray = [];

				_.each(collection.fields || [], function(field) {
					fieldsArray.push({
						name : field.name,
						value : null
					});
				});

				fields(fieldsArray);
			});
		};

		return {
			collectionName : collectionName,
			fields : fields,
			add : add,
			activate : function(args) {
				var self = this;
				feedId(args.feedId);
				collectionId(args.collectionId);
				closeModal = function(obj) {
					self.modal.close(obj);
				};
				return loadCollection(collectionId());
			}
		};

	}(feedData);

	return viewModel;
})
