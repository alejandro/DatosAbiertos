"use strict";

var database = require("../modules/database.js");
var feeds = "feeds";

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
			return col.getAll({orgId: orgId.toString()});
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

	var create = function(name) {
		return getCollection().then(function(col) {
			return col.add({
				name : name
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

	return {
		getAll : getAll,
		getAllByOrgId : getAllByOrgId,
		get : getOne,
		archive : archive,
		create : create,
		correctName : correctName
	};
}();

module.exports = mod;
