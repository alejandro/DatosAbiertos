'use strict';

var database = require('../modules/database.js');
var validation = require('../modules/validation.js');
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

	var modify = function(userId, collectionId, documentId, changes) {
		return getCollection(collectionId).then(function(col) {
			return col.modify(userId, documentId, changes);
		});
	};

	var addData = function(userId, collectionId, doc) {
		return getCollection(collectionId).then(function(col) {
			return col.add(userId, doc);
		});
	};

	var archiveDocument = function(userId, collectionId, documentId) {
		return getCollection(collectionId).then(function(col) {
			return col.archive(userId, documentId);
		});
	};

	var validateModifications = function(feedId, collectionId, documentId, modifications){
		return getCollection(collectionId).then(function(col) {
			return col.getById(documentId).then(function(doc){
				var modifiedDoc = _.extend(doc, modifications);
				return validation.validateDocument(feedId, collectionId, modifiedDoc);
			});
		});
	};
	
	var validateNewDocument = function(feedId, collectionId, newDocument){
		return validation.validateDocument(feedId, collectionId, newDocument);
	};
	
	return {
		getAll : getAll,
		addData : addData,
		archiveDocument : archiveDocument,
		modify : modify,
		validateModifications: validateModifications,
		validateNewDocument: validateNewDocument
	};
}();

module.exports = mod;
