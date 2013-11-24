'use strict';

var database = require('../modules/database.js');
var validation = require('../modules/validation.js');
var collectionModule = require('../modules/collections.js');
var _ = require('underscore');
var q = require('q');

var mod = function() {

	var getMongoCollection = function(collectionId) {
		return database.collection(collectionId.toString());
	};

	var getAll = function(collectionId, query) {
		return getMongoCollection(collectionId).then(function(col) {
			query = _.extend(query || {}, {
				archived: {
					$ne: true
				}
			});
			return col.getAll(query);
		});
	};

	var modify = function(userId, collectionId, documentId, changes) {
		var def = q.defer();
		collectionModule.getById(collectionId).then(function(documentCollection) {
			validateModifications(documentCollection.feedId, collectionId, documentId, changes).then(function(validationErrors) {
				if (validationErrors.length > 0) {
					def.reject(validationErrors);
				} else {
					getMongoCollection(collectionId).then(function(col) {
						col.modify(userId, documentId, changes).then(function(doc) {
							def.resolve(doc);
						});
					});
				}
			});
		});
		return def.promise;
	};

	var addData = function(userId, collectionId, doc) {
		return getMongoCollection(collectionId).then(function(col) {
			return col.add(userId, doc);
		});
	};

	var archiveDocument = function(userId, collectionId, documentId) {
		return getMongoCollection(collectionId).then(function(col) {
			return col.archive(userId, documentId);
		});
	};

	var validateModifications = function(feedId, collectionId, documentId, modifications) {
		return getMongoCollection(collectionId).then(function(col) {
			return col.getById(documentId).then(function(doc) {
				var modifiedDoc = _.extend(doc, modifications);
				return validation.validateDocument(feedId, collectionId, modifiedDoc);
			});
		});
	};

	var validateNewDocument = function(feedId, collectionId, newDocument) {
		return validation.validateDocument(feedId, collectionId, newDocument);
	};

	return {
		getAll: getAll,
		addData: addData,
		archiveDocument: archiveDocument,
		modify: modify,
		validateModifications: validateModifications,
		validateNewDocument: validateNewDocument
	};
}();

module.exports = mod;