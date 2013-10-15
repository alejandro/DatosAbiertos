'use strict';

var database = require('../modules/database.js');
var collectionName = 'accounts';

var mod = function() {

	var getCollection = function() {
		return database.collection(collectionName);
	};

	var getByEmail = function(email) {
		return getCollection().then(function(col) {
			return col.getFirst({
				email : email
			});
		});
	};

	var create = function(email, displayName, firstName, lastName) {
		return getCollection().then(function(col) {
			return col.add({
				email : email,
				displayName : displayName,
				firstName : firstName,
				lastName : lastName
			});
		});
	};

	var addOrg = function(accountId, org) {
		return getCollection().then(function(col) {
			return col.getById(accountId).then(function(account) {
				var orgIds = account.orgs || [];
				orgIds.push(org._id.toString());
				return col.modify(accountId, {
					orgs : orgIds
				});
			});
		});
	};

	return {
		getByEmail : getByEmail,
		create : create,
		addOrg : addOrg
	};
}();

module.exports = mod;
