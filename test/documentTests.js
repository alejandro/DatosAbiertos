"use strict";

var collectionDataModule = require("../modules/documents.js");
var should = require('chai').should();
var database = require("../modules/database.js");
var q = require("q");

describe('Documents', function() {

	var collection = {
		_id : database.newId(),
		name : "test collection"
	};

	beforeEach(function(done) {
		database.drop(collection._id.toString()).then(done);
	});

	describe('when archiving a document in a collection', function() {
		it('should add an archived flag to the data item', function(done) {

			var now = new Date();

			var testDocument = {
				name : "test",
				color : "red",
				cost : 5,
				paidOn : now
			};

			database.collection(collection._id.toString()).then(function(c) {
				c.add(testDocument).then(function(doc) {
					collectionDataModule.archiveDocument(collection._id, doc._id).then(function(archivedDoc) {
						archivedDoc.archived.should.equal(true);
					}).done(done);
				});
			});
		});
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

	describe('when attempting to add empty data to a collection', function() {
		it('should raise the expected error', function(done) {
			collectionDataModule.addData(collection._id, {})
			.fail(function(err) {
				err.should.equal('Cannot add an empty item.');
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
				});
				return c;
			}).then(function(c) {
				c.add({
					name : "test2",
					archived : true
				})
			}).done(function() {

				collectionDataModule.getAll(collection._id).then(function(documents) {
					documents.length.should.equal(1);
					documents[0].name.should.equal("test");
					documents[0].color.should.equal("red");
					documents[0].cost.should.equal(5);
					documents[0].paidOn.toString().should.equal(now.toString());
					documents[0]._id.should.not.be.null;

				}).done(done);
			});
		});
	});
});
