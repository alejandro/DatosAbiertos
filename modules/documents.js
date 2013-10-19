'use strict';

var database = require('../modules/database.js');

var mod = function() {

	var getCollection = function(collectionId) {
		return database.collection(collectionId.toString());
	};

	var getAll = function(collectionId) {
		return getCollection(collectionId).then(function(col) {
			return col.getAll({archived: {$ne:true}});
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
		archiveDocument : archiveDocument
	};
}();

module.exports = mod;
