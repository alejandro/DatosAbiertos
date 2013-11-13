"use strict";

var collectionModule = require("../modules/collections.js");
var should = require('chai').should();
var expect = require('chai').expect;
var database = require("../modules/database.js");
var q = require("q");

describe('Collections', function() {

	var userId = database.newId();
	
	var feed1 = {
		orgId: "orgId",
		name : 'test1',
		collections : [{
			_id : database.newId(),
			name : "test collection6"
		}]
	};
	var feed2 = {
		orgId: "orgId",
		name : 'test2',
		collections : [{
			_id : database.newId(),
			name : "test collection4"
		}, {
			_id : database.newId(),
			name : "test collection5"
		}]
	};
	var feed3 = {
		orgId: "orgId",
		name : 'test3',
		collections : [{
			_id : database.newId(),
			name : "test collection1",
			fields : [{
				name : "one"
			}]
		}, {
			_id : database.newId(),
			name : "test collection2",
			archived : true
		}, {
			_id : database.newId(),
			name : "test collection3"
		}]
	};

	var feed4 = {
		orgId: "orgId",
		name : 'test4',
		archived : true,
		collections : [{
			_id : database.newId(),
			name : "archived collection1"
		}, {
			_id : database.newId(),
			name : "archived collection2"
		}, {
			_id : database.newId(),
			name : "archived collection3"
		}]
	};

	beforeEach(function(done) {
		database.collection("feeds").then(function(coll) {
			coll.add(userId, feed1).then(function() {
				return coll.add(userId, feed2);
			}).then(function() {
				return coll.add(userId, feed3);
			}).then(function(){
				done();
			}).fail(function(err) {
				done(err);
			});
		});
	});

	afterEach(function(done) {
		var deleteAll = function(collectionName, callback) {
			database.currentConnection.collection(collectionName, function(err, coll) {
				coll.remove({}, callback);
			});
		}
		deleteAll("feeds", done);
	});

	describe('when getting a list of collections', function() {
		it('should return a list of collections', function(done) {
			collectionModule.getAll().then(function(collections) {
				collections.length.should.equal(5);
				expect(collections[0].fields).to.be.undefined
				collections[0].orgId.should.equal("orgId");
			}).done(done);
		})
	});
})