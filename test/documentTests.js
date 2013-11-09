"use strict";

var collectionDataModule = require("../modules/documents.js");
var chai = require('chai');
chai.Assertion.includeStack = true;
var should = chai.should();
var database = require("../modules/database.js");
var q = require("q");
var moment = require('moment');

describe('Documents', function() {

	var userId = database.newId();

	var feedId = database.newId();
	var collectionId = database.newId();

	var feed = {
		_id : feedId,
		archived : true,
		name : 'test3',
		collections : [{
			_id : collectionId,
			name : "test collection",
			fields : [{
				dataType : 'text',
				name : 'Name',
				rules : [{
					code : 'textStartsWith',
					value : ':',
					message : 'Name should start with a colon.'
				}]
			}, {
				dataType : 'text',
				name : 'Color'
			}]
		}]
	};

	beforeEach(function(done) {
		var deleteAll = function(collectionName, callback) {
			database.currentConnection().collection(collectionName, function(err, coll) {
				coll.remove({}, callback);
			});
		}
		var addFeeds = function(callback) {

			database.collection("feeds").then(function(coll) {
				coll.add(userId, feed).then(function() {
					callback();
				});
			});
		};

		database.drop(collectionId.toString()).then(function() {
			deleteAll("feeds", function() {
				addFeeds(function() {
					done();
				});
			});
		});
	});

	describe("when validating a new document", function() {
		describe("where new document doesn't follow the validation rules", function() {
			it("should return validation errors", function(done) {

				var newDoc = {
					Name : "new name without colon"
				};

				collectionDataModule.validateNewDocument(feedId, collectionId, newDoc).then(function(result) {
					result.length.should.equal(1);
					result[0].message.should.equal('Name should start with a colon.');
				}).done(done);
			});
		});
		
		describe("where new document follows the validation rules", function() {
			it("should return an empty array", function(done) {

				var newDoc = {
					Name : ":new name with colon"
				};

				collectionDataModule.validateNewDocument(feedId, collectionId, newDoc).then(function(result) {
					result.length.should.equal(0);					
				}).done(done);
			});
		});
	});

	describe("when validating a document with modifications", function() {
		describe("where modified document doesn't follow the validation rules", function() {
			it("should return validation errors", function(done) {

				var testDocument = {
					Name : ":test",
					Color : "red"
				};

				var modifications = {
					Name : "new name without colon"
				};

				database.collection(collectionId.toString()).then(function(c) {
					c.add(userId, testDocument).then(function(doc) {
						collectionDataModule.validateModifications(feedId, collectionId, doc._id, modifications).then(function(result) {
							result.length.should.equal(1);
							result[0].message.should.equal('Name should start with a colon.');
						}).done(done);
					});
				});
			});
		});

		describe("where modified follows the validation rules", function() {
			it("should return an empty array", function(done) {

				var testDocument = {
					Name : ":test",
					Color : "red"
				};

				var modifications = {
					Name : ":new name with colon"
				};

				database.collection(collectionId.toString()).then(function(c) {
					c.add(userId, testDocument).then(function(doc) {
						collectionDataModule.validateModifications(feedId, collectionId, doc._id, modifications).then(function(result) {
							result.length.should.equal(0);
						}).done(done);
					});
				});
			});
		});
	});

	describe("when modifying the data in a document", function() {

		// describe("where document doesn't follow the validation rules", function() {
		// it("should fail with validation errors", function(done) {
		//
		// var testDocument = {
		// Name : "test",
		// Color : "red",
		// ExtraField : "something unwelcome"
		// };
		//
		// var changes = { };
		//
		// database.collection(collectionId.toString()).then(function(c) {
		// c.add(userId, testDocument).then(function(doc) {
		// collectionDataModule.modify(userId, collectionId, doc._id, changes).fail(function(err) {
		// err[0].message.should.equal('Name should start with a colon.');
		// done();
		// });
		// });
		// });
		// });
		// });

		describe("where follows the validation rules", function() {
			it("should update the document in the database", function(done) {

				var testDocument = {
					Name : ":test",
					Color : "red"
				};

				var changes = {
					Name : ':newName',
					Color : 'red robin'
				};

				database.collection(collectionId.toString()).then(function(c) {
					c.add(userId, testDocument).then(function(doc) {
						collectionDataModule.modify(userId, collectionId, doc._id, changes).then(function(modifiedDocument) {
							modifiedDocument.Name.should.equal(changes.Name);
							modifiedDocument.Color.should.equal(changes.Color);
						}).done(done);
					});
				});
			});
		});
	});

	describe('when archiving a document in a collection', function() {
		it('should add an archived flag to the data item', function(done) {

			var now = new Date();

			var testDocument = {
				Name : ":test",
				Color : "red",
				cost : 5,
				paidOn : now
			};

			database.collection(collectionId.toString()).then(function(c) {
				c.add(userId, testDocument).then(function(doc) {
					collectionDataModule.archiveDocument(userId, collectionId, doc._id).then(function(archivedDoc) {
						archivedDoc.archived.should.equal(true);
					}).done(done);
				});
			});
		});
	});

	describe('when adding a document to a collection', function() {
		it('should add the doc to the database', function(done) {
			var now = moment().valueOf();
			var userId = database.newId();
			collectionDataModule.addData(userId, collectionId, {
				Name : ":Toyota Tacoma",
				Color : "red",
				cost : 10000,
				paidOn : now
			}).then(function(newData) {
				newData.Name.should.equal(":Toyota Tacoma");
				newData.Color.should.equal("red");
				newData.cost.should.equal(10000);
				newData.paidOn.toString().should.equal(now.toString());
				newData._id.should.not.be.null;
			}).done(done);
		});
	});

	describe('when attempting to add empty data to a collection', function() {
		it('should raise the expected error', function(done) {
			collectionDataModule.addData(userId, collectionId, {}).fail(function(err) {
				err.should.equal('Cannot add an empty item.');
			}).done(done);
		});
	});

	describe('when getting data for a collection', function() {
		it('should return the expected data', function(done) {

			var now = new Date();

			database.collection(collectionId.toString()).then(function(c) {
				c.add(userId, {
					Name : ":test",
					Color : "red",
					cost : 5,
					paidOn : now
				});
				return c;
			}).then(function(c) {
				c.add(userId, {
					Name : "test2",
					archived : true
				})
			}).done(function() {

				collectionDataModule.getAll(collectionId).then(function(documents) {
					documents.length.should.equal(1);
					documents[0].Name.should.equal(":test");
					documents[0].Color.should.equal("red");
					documents[0].cost.should.equal(5);
					documents[0].paidOn.toString().should.equal(now.toString());
					documents[0]._id.should.not.be.null;

				}).done(done);
			});
		});
	});

	describe('when querying data for a collection', function() {
		it('should return the expected queried data', function(done) {

			var now = new Date();

			database.collection(collectionId.toString()).then(function(c) {
				c.add(userId, {
					Name : ":test2",
					Color : "red",
					cost : 5,
					paidOn : now
				});
				return c;
			}).then(function(c) {
				c.add(userId, {
					Name : ":test1",
					Color : "blueberry",
					cost : 10,
					paidOn : now
				});
				return c;
			}).then(function(c) {
				c.add(userId, {
					Name : ":test3",
					cost : 10,
					paidOn : now
				});
			}).done(function() {

				var query = {
					"$where" : "(this.Color||'').indexOf('blue')>-1"
				};

				collectionDataModule.getAll(collectionId, query).then(function(documents) {
					documents.length.should.equal(1);
					documents[0].Name.should.equal(":test1");
					documents[0].Color.should.equal("blueberry");
					documents[0].cost.should.equal(10);
					documents[0].paidOn.toString().should.equal(now.toString());
					documents[0]._id.should.not.be.null;

				}).done(done);
			});
		});
	});
});
