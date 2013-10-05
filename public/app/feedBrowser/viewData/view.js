define(['feedBrowser/feedData', 'durandal/app', 'foreachprop'], function(feedData, app) {

	var viewModel = function(api) {

		var feedName = ko.observable();
		var collectionName = ko.observable();
		var fields = ko.observableArray([]);
		var data = ko.observableArray([]);

		var loadCollection = function(feedId, collectionId) {
			return api.getById(feedId).done(function(feed) {
				feedName(feed.name);

				var collection = _.find(feed.collections || [], function(coll) {
					return coll._id == collectionId;
				});

				collectionName(collection.name);
				fields(collection.fields);

				loadData();
			});
		};

		var loadData = function() {
			api.getCollectionData(collectionId()).done(function(d) {
				var items = [];
				_.each(d, function(i) {
					var item={};
					_.each(fields(), function(field) {
						item[field.name] = i[field.name];
					});
					items.push(item);
				});
				data(items);
			});
		};

		var addData = function() {
			app.showModal('feedBrowser/addData/add', {
				feedId : feedId(),
				collectionId : collectionId()
			}).then(function(newData) {
				api.addDataToCollection(collectionId(), newData).then(function() {
					loadData();
				});
			});
		};

		var feedId = ko.observable();
		var collectionId = ko.observable();

		return {
			feedName : feedName,
			collectionName : collectionName,
			fields : fields,
			data : data,
			addData : addData,
			activate : function(args) {
				feedId(args.feedId);
				collectionId(args.collectionId);
				return loadCollection(feedId(), collectionId());
			}
		};
	}(feedData);

	return viewModel;
});
