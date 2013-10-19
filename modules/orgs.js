'use strict';

var q = require('q');
var _ = require('underscore');
var database = require('../modules/database.js');
var accounts = require('../modules/accounts.js');
var collectionName = 'orgs';

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
		var orgToAdd = {
			name : name,
			admins : [firstAdminAccountId.toString()]
		};
		getCollection().then(function(col) {
			col.add(orgToAdd).then(function(newOrg) {
				accounts.addOrg(firstAdminAccountId, newOrg).then(function() {
					def.resolve(newOrg);
				});
			});
		});
		return def.promise;
	};

	var getAllForAccount = function(accountId) {
		return getCollection().then(function(coll) {
			return coll.getAll({
				admins : accountId.toString()
			});
		});
	};

	var addApplication = function(orgId, applicationsName) {
		return getCollection().then(function(col) {
			return col.getById(orgId).then(function(org) {
				var applications = org.applications || [];
				applications.push({
					_id : database.newId(),
					name : applicationsName
				});

				return col.modify(orgId, {
					applications : applications
				});
			});
		});
	};

	var addApplicationUser = function(orgId, appId, newUser) {
		return getCollection().then(function(col) {
			return col.getById(orgId).then(function(org) {
				var applications = org.applications || [];
				_.each(org.applications, function(a) {
					if (a._id.toString() == appId.toString()) {
						if (!a.users) {
							a.users = [];
						}
						a.users.push({
							_id : database.newId(),
							name : newUser.name,
							username : newUser.username,
							password : newUser.password,
							email : newUser.email
						});
					}
				});

				return col.modify(orgId, {
					applications : applications
				});
			});
		});
	};

	var modifyApplicationUser = function(orgId, appId, userId, mods) {
		return getCollection().then(function(col) {
			return col.getById(orgId).then(function(org) {
				var applications = _.map(org.applications || [], function(a) {
					if (a._id.toString() == appId.toString()) {
						a.users = _.map(a.users, function(u) {
							if (u._id.toString() == userId.toString()) {
								u.name = mods.name;
								u.username = mods.username;
								u.email = mods.email;
							}
							return u;
						});
					}
					return a;
				});
				return col.modify(orgId, {
					applications : applications
				});
			});
		});
	};

	var getApplicationUser = function(appId, username, password) {
		return getCollection().then(function(col) {
			var bsonAppId = database.getId(appId.toString());
			col.getFirst({
				applications : {
					$elemMatch : {
						_id : bsonAppId
					}
				}
			}).then(function(org){
				if (Object.keys(org).length==0){
					throw new Error("Org", "Application user was not found for given credentials.")
				}				
				var app = _.find(org.applications, function(a) {
					return a._id.toString() == appId.toString()
				});
				if (!app){
					throw new Error("Token", "Application user was not found for given credentials.")
				}				
				var user = _.find(app.users, function(u) {
					return u.username == username && u.password == password
				});
				if(!user)
					throw new Error("User", "Application user was not found for given credentials.")
				return user;
					
			});
			
		});
	};

	return {
		getById : getById,
		create : create,
		getAllForAccount : getAllForAccount,
		addApplication : addApplication,
		addApplicationUser : addApplicationUser,
		modifyApplicationUser : modifyApplicationUser,
		getApplicationUser : getApplicationUser
	};
}();

module.exports = mod;
