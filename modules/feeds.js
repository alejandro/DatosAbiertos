"use strict";

var database = require("../modules/database.js");
var feeds = "feeds";
var q = require("q");
var _ = require('underscore');

var mod = function() {

	var getCollection = function() {
		return database.collection(feeds);
	};

	var getAll = function() {
		return getCollection().then(function(col) {
			return col.getAll();
		});
	};

	var getAllByOrgId = function(orgId) {
		return getCollection().then(function(col) {
			return col.getAll({
				orgId : orgId.toString()
			});
		});
	};

	var getOne = function(id) {
		return getCollection().then(function(col) {
			return col.getById(id);
		});
	};

	var archive = function(id) {
		return getCollection().then(function(col) {
			return col.modify(id, {
				archived : true
			});
		});
	};

	var create = function(name, orgId) {
		return getCollection().then(function(col) {
			return col.add({
				name : name,
				orgId : orgId.toString()
			});
		});
	};

	var correctName = function(id, correctedName) {
		return getCollection().then(function(col) {
			return col.modify(id, {
				name : correctedName
			});
		});
	};

	var addCollection = function(feedId, collectionName) {

		if (!collectionName || collectionName == null) {
			var def = q.defer();
			def.reject("Validation error! Must include name when creating a collection.");
			return def.promise;
		}

		return getCollection().then(function(col) {
			return col.getById(feedId).then(function(feed) {
				var collections = feed.collections || [];
				collections.push({
					_id : database.newId(),
					name : collectionName
				});

				return col.modify(feedId, {
					collections : collections
				});
			});
		});
	};

	var addField = function(feedId, collectionId, name, dataType) {		
		return getCollection().then(function(col) {
			return col.getById(feedId).then(function(feed) {
				var collections = _.map(feed.collections, function(c) {

					if (c._id.toString() == collectionId.toString()) {

						var fields = c.fields || [];
						fields.push({
							_id : database.newId(),
							name : name,
							dataType: dataType || "text"
						});
						c.fields = fields;
					}
					return c;
				});

				return col.modify(feedId, {
					collections : collections
				});
			});
		});
	};

	var modifyField = function(feedId, collectionId, fieldId, name, dataType) {
		return getCollection().then(function(col) {
			return col.getById(feedId).then(function(feed) {

				var collections = _.map(feed.collections, function(c) {

					if (c._id.toString() == collectionId.toString()) {

						c.fields = _.map(c.fields, function(f) {

							if (f._id.toString() == fieldId.toString()) {

								f.name = name;
								f.dataType = dataType;
							}

							return f;
						});
					}
					return c;
				});

				return col.modify(feedId, {
					collections : collections
				});
			});
		});
	};

	return {
		getAll : getAll,
		getAllByOrgId : getAllByOrgId,
		get : getOne,
		archive : archive,
		create : create,
		correctName : correctName,
		addCollection : addCollection,
		addField : addField,
		modifyField : modifyField
	};
}();

module.exports = mod;
