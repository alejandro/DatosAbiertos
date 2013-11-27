'use strict';

var chai  				= require('chai');
var q             = require('q');
var accountModule = require('../modules/accounts.js');
var database      = require('../modules/database.js');
var fixtures      = require('./fixtures/before')(database);
var should        = chai.should();

chai.Assertion.includeStack = true;

describe('Accounts', function() {
	var userId = database.newId();
	
	var account1 = {
		email : 'byron@acklenavenue.com'
	};
	var account2 = {
		email : 'mario@acklenavenue.com'
	};
	var account3 = {
		email : 'viktor@acklenavenue.com'
	};

	beforeEach(function(done) {
		var collection;
		database.collection('accounts').then(function(coll) {
			collection = coll;
			return collection.add(userId, account1)
		}).then(function() {
			return collection.add(userId, account2);
		}).then(function() {
			return collection.add(userId, account3);
		}).then(fixtures.ok).done(done);
	});

	afterEach(function(done) {
		database.currentConnection.collection('accounts', function(err, coll) {
			coll.remove({}, {
				safe : true
			}, done);
		});
	});

	describe('when getting an account by identifier', function() {
		it('should return return the expected account', function(done) {
			accountModule.getByEmail(account1.email).then(function(account) {
				return account.email.should.equal(account1.email);
			}).then(fixtures.ok).done(done);
		})
	});

	describe('when creating a new account', function() {
		it('should add the account to the database', function(done) {
			var displayName = 'Johnny Appleseed';
			var firstName = 'Johnny';
			var lastName = 'Appleseed';
			var email = 'johnny@appleseed.com';
			var newAccount;

			accountModule.create(userId, email, displayName, firstName, lastName).then(function(account) {
				newAccount = account;
				return database.collection('accounts')
			}).then(function(col) {
				return col.getById(newAccount._id)
			}).then(function(accountInDatabase) {
				accountInDatabase.displayName.should.equal(displayName);
				accountInDatabase.firstName.should.equal(firstName);
				accountInDatabase.lastName.should.equal(lastName);
				accountInDatabase.email.should.equal(email);
				return;
			}).done(done);
		})
	});
});
