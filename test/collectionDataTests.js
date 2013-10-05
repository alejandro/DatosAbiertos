"use strict";

var collectionDataModule = require("../modules/collectionData.js");
var should = require('chai').should();
var database = require("../modules/database.js");
var q = require("q");

describe('CollectionData', function() {

	var collection = {
		_id : database.newId(),
		name : "test collection"
	};

	beforeEach(function(done) {
		database.collection(collection._id.toString()).then(function(c) {
			//do nothing
		}).done(done);
	});

	afterEach(function(done) {
		var deleteAll = function(collectionName, callback) {
			database.currentConnection().collection(collectionName, function(err, coll) {
				coll.remove({}, callback);
			});
		}
		deleteAll(collection._id.toString(), done);
	});

	describe('when adding data to a collection', function() {
		it('should add the object to the database', function(done) {
			var now = new Date();
			collectionDataModule.addData(collection._id, {
				name : "Toyota Tacoma",
				color : "red",
				cost : 10000,
				paidOn : now
			}).then(function(newData) {
				newData.name.should.equal("Toyota Tacoma");
				newData.color.should.equal("red");
				newData.cost.should.equal(10000);
				newData.paidOn.toString().should.equal(now.toString());
				newData._id.should.not.be.null;
			}).done(done);
		});
	});

	describe('when getting data for a collection', function() {
		it('should return the expected data', function(done) {

			var now = new Date();

			database.collection(collection._id.toString()).then(function(c) {
				c.add({
					name : "test",
					color : "red",
					cost : 5,
					paidOn : now
				}).done(function() {

					collectionDataModule.getAll(collection._id).then(function(data) {
						data.length.should.equal(1);
						data[0].name.should.equal("test");
						data[0].color.should.equal("red");
						data[0].cost.should.equal(5);
						data[0].paidOn.toString().should.equal(now.toString());
						data[0]._id.should.not.be.null;

					}).done(done);
				});
			});
		});
	});

});
