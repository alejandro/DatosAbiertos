'use strict';

var collectionName = 'accounts';

var database = require('../modules/database.js');
var q = require('q');
var _ = require('underscore');

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

	var getById = function(accountId) {
		return getCollection().then(function(col) {
			return col.getById(accountId);
		});
	};

	var search = function(text) {
		return getCollection().then(function(col) {
			var query = {
				"email" : {
					$regex : ".*" + text + ".*"
				}
			};
			
			return col.getAll(query);
		});
	};

	var getByIds = function(arrayOfAccountIds) {
		return getCollection().then(function(col) {
			return q.all(_.map(arrayOfAccountIds, function(id) {
				return col.getById(id);
			}));
		});
	};

	var create = function(userId, email, displayName, firstName, lastName) {
		return getCollection().then(function(col) {
			return col.add(userId, {
				email : email,
				displayName : displayName,
				firstName : firstName,
				lastName : lastName
			});
		});
	};

	var addOrg = function(userId, accountId, org) {
		return getCollection().then(function(col) {
			return col.getById(accountId).fail(function(err) {
				console.log("Account error: " + err);
			}).then(function(account) {
				var orgIds = account.orgs || [];
				orgIds.push(org._id.toString());
				return col.modify(userId, accountId, {
					orgs : orgIds
				});
			});
		});
	};

	var removeOrg = function(userId, accountId, org) {
		return getCollection().then(function(col) {
			return col.getById(accountId).fail(function(err) {
				console.log("Account error: " + err);
			}).then(function(account) {
				var orgIds = _.filter(account.orgs || [], function(id) {
					return id.toString() !== accountId.toString();
				});
				return col.modify(userId, accountId, {
					orgs : orgIds
				});
			});
		});
	};

	return {
		getByEmail : getByEmail,
		create : create,
		addOrg : addOrg,
		getById : getById,
		getByIds : getByIds,
		removeOrg : removeOrg,
		search : search
	};
}();

module.exports = mod;
