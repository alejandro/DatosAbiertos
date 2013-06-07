"use strict";

var orgModule = require("../modules/orgs.js");
var should = require('chai').should();
var database = require("../modules/database.js");
var q = require("q");

describe('Orgs', function() {

	var org1 = {
		name : "Police"
	};
	var org2 = {
		name : "Firemen"
	};
	var org3 = {
		name : "Healthcare"
	};

	var account1 = {
		email : "byron@acklenavenue.com",
		orgs : [1, 2, 3]
	};

	beforeEach(function(done) {

		var deleteAll = function(collectionName, callback) {
			return database.currentConnection().collection(collectionName, function(err, coll) {
				coll.remove({}, callback);
			});
		}
		var createTestData = function() {
			return database.collection("accounts").then(function(accountsColl) {
				return accountsColl.add(account1);
			}).then(function() {
				return database.collection("orgs").then(function(orgsColl) {
					return orgsColl.add(org1);
				});
			}).then(function() {
				return database.collection("orgs").then(function(orgsColl) {
					return orgsColl.add(org2);
				});
			}).then(function() {
				return database.collection("orgs").then(function(orgsColl) {
					return orgsColl.add(org3);
				});
			});
		};

		deleteAll("orgs", deleteAll("accounts", function() {
			createTestData().done(function() {
				done();
			});
		}));
	});

	describe('when getting an org by id', function() {
		it('should return the expected org', function(done) {
			orgModule.getById(org1._id).then(function(org) {
				org.name.should.equal(org1.name);
			}).done(done);
		});
	});

	describe('when getting all orgs for an account', function() {
		it('should return the expected orgs where account is an admin', function(done) {
			orgModule.create("org1", account1._id).done(function(newOrg1) {
				orgModule.create("org2", account1._id).done(function(newOrg2) {
					orgModule.getAllForAccount(account1._id.toString()).then(function(orgs) {
						orgs[0].name.should.equal(newOrg1.name);
						orgs[1].name.should.equal(newOrg2.name);
						orgs.length.should.equal(2);

						database.collection("accounts").then(function(col) {
							return col.getById(account1._id).then(function(accountInDatabase) {
								accountInDatabase._id.toString().should.equal(account1._id.toString());
								accountInDatabase.orgs.should.include(newOrg1._id.toString());
								accountInDatabase.email.should.equal("byron@acklenavenue.com");
							}).done(done);
						});
					});
				});
			})
		});
	});

	describe('when creating a new org', function(specDone) {
		it('should add the org to the database', function(done) {
			var name = "Voting Records Test";
			orgModule.create(name, account1._id).then(function(newOrg) {
				database.collection("orgs").then(function(col) {
					return col.getById(newOrg._id).then(function(orgInDatabase) {
						orgInDatabase.name.should.equal(name);
						orgInDatabase.admins.should.include(account1._id.toString());
					}).done(done);
				});
			});
		});

		it('should add the org to the account', function(done) {
			var name = "Traffic Statistics";
			orgModule.create(name, account1._id).then(function(newOrg) {
				database.collection("accounts").then(function(accountCol) {
					accountCol.getById(account1._id).then(function(accountInDatabase) {
						accountInDatabase.orgs.should.include(newOrg._id.toString());
					}).done(done);
				});
			});
		});
	});
});
