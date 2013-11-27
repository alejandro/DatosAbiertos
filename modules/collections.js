'use strict';

var database = require('../modules/database.js');
var _ = require('underscore');

var mod = function() {

	var getCollection = function() {
		return database.collection('feeds');
	};

	var getAll = function() {
		return getCollection().then(function(col) {
			return col.getAll({
				archived: {
					$ne: true
				}
			}).then(function(feeds) {
				var collections = [];
				_.each(feeds, function(f) {
					var filteredCollections = _.filter(f.collections, function(c) {
						return c.archived !== true;
					});
					var mappedCollections = _.map(filteredCollections, function(c) {
						return {
							_id: c._id,
							name: c.name,
							orgId: f.orgId,
							feedId: f._id
						};
					});
					collections = collections.concat(mappedCollections);
				});
				return collections;
			});
		});
	};

	var getById = function(collectionId) {
		return getCollection().then(function(col) {
			return col.getAll({
				archived: {
					$ne: true
				}
			}).then(function(feeds) {
				var collections = [];
				_.each(feeds, function(f) {
					var filteredCollections = _.filter(f.collections, function(c) {
						return c.archived !== true;
					});
					var mappedCollections = _.map(filteredCollections, function(c) {
						return {
							_id: c._id,
							name: c.name,
							orgId: f.orgId,
							feedId: f._id,
							code: c.code
						};
					});
					collections = collections.concat(mappedCollections);
				});

				var match = _.find(collections, function(c) {
					return c._id.toString() === collectionId.toString();
				});

				if (!match) throw new Error('Collection not found by the id ' + collectionId);

				return match;
			});
		});
	};

	var getByCode = function(feedId, collectionCode) {
		return getCollection().then(function(col) {
			return col.getAll({
				archived: {
					$ne: true
				}
			}).then(function(feeds) {

				var feed = _.find(feeds, function(f) {
					return f._id.toString() === feedId.toString();
				});
				if (!feed) throw new Error('Feed not found with the id ' + feedId);

				var match = _.find(feed.collections || [], function(c) {
					return c.code === collectionCode;
				});

				match.feedId = feed._id;
				
				if (!match) throw new Error('Collection not found with the code ' + collectionCode);

				return match;
			});
		});
	};

	return {
		getAll: getAll,
		getById: getById,
		getByCode: getByCode
	};
}();

module.exports = mod;