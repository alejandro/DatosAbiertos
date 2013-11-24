'use strict';

var collectionModule = require('../modules/collections.js');
var expect = require('chai').expect;
var database = require('../modules/database.js');

require('chai').should();

describe('Collections', function() {

	var userId = database.newId();

	var feed1 = {
		orgId: database.newId(),
		name: 'test1',
		collections: [{
			_id: 'some really long bson id',
			name: 'test collection6'
		}]
	};
	var feed2 = {
		orgId: database.newId(),
		name: 'test2',
		collections: [{
			_id: database.newId(),
			name: 'test collection4'
		}, {
			_id: database.newId(),
			name: 'test collection5'
		}]
	};
	var feed3 = {
		orgId: database.newId(),
		name: 'test3',
		collections: [{
			_id: 'collection that has fields for validation',
			name: 'test collection1',
			fields: [{
				name: 'one'
			}]
		}, {
			_id: database.newId(),
			name: 'test collection2',
			archived: true
		}, {
			_id: database.newId(),
			name: 'test collection3'
		}]
	};

	beforeEach(function(done) {
		var deleteAll = function(collectionName, callback) {
			database.currentConnection().collection(collectionName, function(err, coll) {
				coll.remove({}, callback);
			});
		};
		deleteAll('feeds', function() {
			database.collection('feeds').then(function(coll) {
				coll.add(userId, feed1).then(function() {
					return coll.add(userId, feed2);
				}).then(function() {
					return coll.add(userId, feed3);
				}).then(function() {
					done();
				}).fail(function(err) {
					done(err);
				});
			});
		});
	});

	describe('when getting a list of collections', function() {
		it('should return a list of collections', function(done) {
			collectionModule.getAll().then(function(collections) {
				collections.length.should.equal(5);
			}).done(done);
		});
	});

	describe('when getting one collection by id', function() {
		it('should return the expected collection', function(done) {
			var theCollection = feed1.collections[0];
			collectionModule.getById(theCollection._id).then(function(collectionFromDb) {
				collectionFromDb.feedId.toString().should.equal(feed1._id.toString());
			}).done(done);
		});
	});
});