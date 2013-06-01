"use strict";

var database = require("../modules/database.js");
var accounts = require("../modules/accounts.js");
var collectionName = "orgs";
var q = require("q");

var mod = function() {

	var getCollection = function() {
		return database.collection(collectionName);
	};

	var getById = function(id) {
		return getCollection().then(function(col) {
			return col.getById(id);
		});
	};

	var create = function(name, firstAdminAccountId) {		
		var def = q.defer();
		var orgToAdd = { name : name, admins : [firstAdminAccountId.toString()] };
		getCollection().then(function(col) {
			col.add(orgToAdd).then(function(newOrg) {
				accounts.addOrg(firstAdminAccountId, newOrg).then(function(){
					def.resolve(newOrg);
				});
			});
		});
		return def.promise;
	};

	return {
		getById : getById,
		create : create
	};
}();

module.exports = mod;
