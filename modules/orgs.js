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

	var getByCode = function(code) {
		return getCollection().then(function(col) {
			return col.getFirst({
				code: code
			});
		});
	};

	var create = function(userId, name, code, firstAdminAccountId) {
		var def = q.defer();
		var orgToAdd = {
			name: name,
			code: code,
			admins: [firstAdminAccountId.toString()]
		};
		var create = function(col) {
			col.add(userId, orgToAdd).then(function(newOrg) {
				accounts.addOrg(userId, firstAdminAccountId, newOrg).then(function() {
					def.resolve(newOrg);
				});
			});
		};
		getCollection().then(function(col) {
			col.getFirst({
				code: code
			}).then(function(org) {
				def.reject("The org code '" + newCode + "' already exists in another org!");
			}).fail(function() {
				create(col);
			});			
		});
		return def.promise;
	};

	var changeCode = function(userId, orgId, newCode) {
		var def = q.defer();

		var modify = function(col) {
			col.modify(userId, orgId, {
				code: newCode
			}).then(function(org) {
				def.resolve(org);
			});
		};

		getCollection().then(function(col) {
			col.getFirst({
				code: newCode
			}).then(function(org) {
				if (org._id.toString() === orgId.toString()) {
					modify(col);
				} else {
					def.reject("The org code '" + newCode + "' already exists in another org!");
				}
			}).fail(function() {
				modify(col);
			});
		});
		return def.promise;
	};

	var addAdminUser = function(userId, orgId, adminUserId) {
		var def = q.defer();
		getCollection().then(function(col) {
			col.getById(orgId).then(function(org) {
				if (!org.admins)
					org.admins = [];
				org.admins.push(adminUserId);
				delete org.history;
				col.modify(userId, orgId, org).then(function(modifiedOrg) {
					accounts.addOrg(userId, adminUserId, modifiedOrg).then(function() {
						def.resolve(modifiedOrg);
					});
				});
			});
		});
		return def.promise;
	};

	var removeAdminUser = function(userId, orgId, adminUserId) {
		var def = q.defer();
		getCollection().then(function(col) {
			col.getById(orgId).fail(function(err) {
				console.log("Org Errior: " + err);
			}).then(function(org) {
				var modifiedAdmins = _.filter(org.admins || [], function(id) {
					return id && id.toString() != adminUserId.toString();
				});
				col.modify(userId, orgId, {
					admins: modifiedAdmins
				}).then(function(modifiedOrg) {
					accounts.removeOrg(userId, adminUserId, modifiedOrg).then(function() {
						def.resolve(modifiedOrg);
					});
				});
			});
		});
		return def.promise;
	};

	var getAllForAccount = function(accountId) {
		return getCollection().then(function(coll) {
			return coll.getAll({
				admins: accountId.toString()
			});
		});
	};

	var addApplication = function(userId, orgId, applicationsName) {
		return getCollection().then(function(col) {
			return col.getById(orgId).then(function(org) {
				var applications = org.applications || [];
				applications.push({
					_id: database.newId(),
					name: applicationsName
				});

				return col.modify(userId, orgId, {
					applications: applications
				});
			});
		});
	};

	var addApplicationUser = function(userId, orgId, appId, newUser) {
		return getCollection().then(function(col) {
			return col.getById(orgId).then(function(org) {
				var applications = org.applications || [];
				_.each(org.applications, function(a) {
					if (a._id.toString() == appId.toString()) {
						if (!a.users) {
							a.users = [];
						}
						a.users.push({
							_id: database.newId(),
							name: newUser.name,
							username: newUser.username,
							password: newUser.password,
							email: newUser.email
						});
					}
				});

				return col.modify(userId, orgId, {
					applications: applications
				});
			});
		});
	};

	var modifyApplicationUser = function(userModifyingId, orgId, appId, userId, mods) {
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
				return col.modify(userModifyingId, orgId, {
					applications: applications
				});
			});
		});
	};

	var getApplicationUser = function(appId, username, password) {
		var def = q.defer();

		getCollection().then(function(col) {
			col.getFirst({
				applications: {
					$elemMatch: {
						_id: database.getId(appId.toString())
					}
				}
			}).fail(function(err) {
				def.reject("Application user was not found for given credentials. (O1)")
			}).then(function(org) {

				var app = _.find(org.applications, function(a) {
					return a._id.toString() == appId.toString()
				});
				if (!app) {
					def.reject("Application user was not found for given credentials. (A1)")
				}
				var user = _.find(app.users, function(u) {
					return u.username == username && u.password == password
				});
				if (!user)
					def.reject("Application user was not found for given credentials. (U1)");
				def.resolve(user);

			});

		});


		
		return def.promise;
	};

    var archive =  function(userId, orgId){
        return getCollection().then(function(col) {
            return col.archive(userId, orgId);
        });
    };

	return {
		getById: getById,
		create: create,
		getAllForAccount: getAllForAccount,
		addApplication: addApplication,
		addApplicationUser: addApplicationUser,
		modifyApplicationUser: modifyApplicationUser,
		getApplicationUser: getApplicationUser,
		addAdminUser: addAdminUser,
		getApplicationUser : getApplicationUser,
        archive: archive
		removeAdminUser: removeAdminUser,
		getByCode: getByCode,
		changeCode: changeCode
	};
}();

module.exports = mod;