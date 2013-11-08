"use strict";

var accountModule = require("../modules/accounts.js");
var should = require('chai').should();
var database = require("../modules/database.js");
var q = require("q");

describe('Accounts', function() {

	var userId = database.newId();
	
	var account1 = {
		email : "byron@acklenavenue.com"
	};
	var account2 = {
		email : "mario@acklenavenue.com"
	};
	var account3 = {
		email : "viktor@acklenavenue.com"
	};

	beforeEach(function(done) {
		database.collection("accounts").then(function(coll) {
			coll.add(userId, account1).then(function() {
				return coll.add(userId, account2);
			}).then(function() {
				return coll.add(userId, account3);
			});
		}).done(done);
	});

	afterEach(function(done) {
		database.currentConnection().collection("accounts", function(err, coll) {
			coll.remove({}, {
				safe : true
			}, done);
		});
	});

	describe('when getting an account by identifier', function() {
		it('should return return the expected account', function(done) {
			accountModule.getByEmail(account1.email).then(function(account) {
				account.email.should.equal(account1.email);
			}).done(done);
		})
	});

	describe('when creating a new account', function() {
		it('should add the account to the database', function(done) {
			var displayName = "Johnny Appleseed";
			var firstName = "Johnny";
			var lastName = "Appleseed";
			var email = "johnny@appleseed.com";

			accountModule.create(userId, email, displayName, firstName, lastName).then(function(newAccount) {
				database.collection("accounts").then(function(col) {
					col.getById(newAccount._id).then(function(accountInDatabase) {
						accountInDatabase.displayName.should.equal(displayName);
						accountInDatabase.firstName.should.equal(firstName);
						accountInDatabase.lastName.should.equal(lastName);
						accountInDatabase.email.should.equal(email);					
					}).done(done);
				});
			});
		})
	});
});
