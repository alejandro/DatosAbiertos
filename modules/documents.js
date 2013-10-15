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

	var addData = function(collectionId, dataObject) {
		return getCollection(collectionId).then(function(col) {
			return col.add(dataObject);
		});
	};

	//
	// var getAllByOrgId = function(orgId) {
	// return getCollection().then(function(col) {
	// return col.getAll({
	// orgId : orgId.toString()
	// });
	// });
	// };
	//
	// var getOne = function(id) {
	// return getCollection().then(function(col) {
	// return col.getById(id);
	// });
	// };
	//

	var archiveDocument = function(collectionId, documentId) {
		return getCollection(collectionId).then(function(col) {
			return col.modify(documentId, {
				archived : true
			});
		});
	};

	// var correctName = function(id, correctedName) {
	// return getCollection().then(function(col) {
	// return col.modify(id, {
	// name : correctedName
	// });
	// });
	// };
	//
	// var addCollection = function(feedId, collectionName) {
	//
	// if (!collectionName || collectionName == null) {
	// var def = q.defer();
	// def.reject("Validation error! Must include name when creating a collection.");
	// return def.promise;
	// }
	//
	// return getCollection().then(function(col) {
	// return col.getById(feedId).then(function(feed) {
	// var collections = feed.collections || [];
	// collections.push({
	// _id : database.newId(),
	// name : collectionName
	// });
	//
	// return col.modify(feedId, {
	// collections : collections
	// });
	// });
	// });
	// };
	//
	// var addField = function(feedId, collectionId, name, dataType) {
	// return getCollection().then(function(col) {
	// return col.getById(feedId).then(function(feed) {
	// var collections = _.map(feed.collections, function(c) {
	//
	// if (c._id.toString() == collectionId.toString()) {
	//
	// var fields = c.fields || [];
	// fields.push({
	// _id : database.newId(),
	// name : name,
	// dataType: dataType || "text"
	// });
	// c.fields = fields;
	// }
	// return c;
	// });
	//
	// return col.modify(feedId, {
	// collections : collections
	// });
	// });
	// });
	// };
	//
	// var modifyField = function(feedId, collectionId, fieldId, name, dataType) {
	// return getCollection().then(function(col) {
	// return col.getById(feedId).then(function(feed) {
	//
	// var collections = _.map(feed.collections, function(c) {
	//
	// if (c._id.toString() == collectionId.toString()) {
	//
	// c.fields = _.map(c.fields, function(f) {
	//
	// if (f._id.toString() == fieldId.toString()) {
	//
	// f.name = name;
	// f.dataType = dataType;
	// }
	//
	// return f;
	// });
	// }
	// return c;
	// });
	//
	// return col.modify(feedId, {
	// collections : collections
	// });
	// });
	// });
	// };

	return {
		getAll : getAll,
		addData : addData,
		archiveDocument : archiveDocument
		// getAllByOrgId : getAllByOrgId,
		// get : getOne,
		// create : create,
		// correctName : correctName,
		// addCollection : addCollection,
		// addField : addField,
		// modifyField : modifyField
	};
}();

module.exports = mod;
