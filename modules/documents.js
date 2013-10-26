'use strict';

var database = require('../modules/database.js');
var _ = require('underscore');

var mod = function() {

	var getCollection = function(collectionId) {
		return database.collection(collectionId.toString());
	};

	var getAll = function(collectionId, query) {
		return getCollection(collectionId).then(function(col) {
			query = _.extend(query || {}, {
				archived : {
					$ne : true
				}
			});
			return col.getAll(query);
		});
	};

	var modify = function(collectionId, documentId, changes) {
		return getCollection(collectionId).then(function(col) {
			return col.modify(documentId, changes);
		});
	};

	var addData = function(collectionId, doc) {
		return getCollection(collectionId).then(function(col) {
			return col.add(doc);
		});
	};

	var archiveDocument = function(collectionId, documentId) {
		return getCollection(collectionId).then(function(col) {
			return col.modify(documentId, {
				archived : true
			});
		});
	};

	return {
		getAll : getAll,
		addData : addData,
		archiveDocument : archiveDocument,
		modify : modify
	};
}();

module.exports = mod;
