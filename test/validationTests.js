"use strict";

var validationModule = require("../modules/validation.js");
var chai = require('chai');
var moment = require('moment');
chai.Assertion.includeStack = true;
var should = chai.should();
var database = require("../modules/database.js");
var q = require("q");

describe('Validation', function() {

	var userId = database.newId();

	var feedId = database.newId();
	var collectionId = database.newId();

	var feed = {
		_id : feedId,
		archived : true,
		name : 'test3',
		collections : [{
			_id : collectionId,
			name : "test collection1",
			fields : [{
				_id : database.newId(),
				name : 'First Name',
				dataType : 'text',
				rules : [{
					_id : database.newId(),
					code : 'textEqualTo',
					value : 'Byron'
				}]
			}, {
				_id : database.newId(),
				name : 'Last Name',
				dataType : 'text',
				rules : [{
					_id : database.newId(),
					code : 'textEqualTo',
					value : 'Sommardahl',
					message : "Custom validation message"
				}]
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

		deleteAll("feeds", function() {
			addFeeds(function() {
				done();
			});
		});
	});

	describe('when validating a document', function() {

		describe('where document follows validation rules', function() {
			it('should not return any validation errors', function(done) {

				var documentToValidate = {
					'First Name' : 'Byron',
					'Last Name' : 'Sommardahl'
				};

				validationModule.validateDocument(feedId, collectionId, documentToValidate).then(function(results) {
					results.length.should.equal(0);
				}).done(done);
			})
		});

		describe('where document does not follow validation rules', function() {
			it('should return the expected validation errors', function(done) {

				var documentToValidate = {
					'First Name' : 'Don',
					'Last Name' : 'Brown'
				};

				validationModule.validateDocument(feedId, collectionId, documentToValidate).then(function(results) {

					//console.log(results);
					results.length.should.equal(2);
					results[0].field.should.equal('First Name');
					results[0].message.should.equal('Invalid');

					results[1].field.should.equal('Last Name');
					results[1].message.should.equal('Custom validation message');

				}).done(done);
			})
		});
	});

	describe('validating a text field', function() {
		describe('where validation type is "textEqualTo"', function() {
			it('should return false for a non-match', function(done) {
				var result = validationModule.fieldIsValid('textEqualTo', 'Byron', 'Don');
				result.should.be.false;
				done();
			});
			
			it('should return true for a match', function(done) {
				var result = validationModule.fieldIsValid('textEqualTo', 'Byron', 'Byron');
				result.should.be.true;
				done();
			})
		});
		
		describe('where validation type is "textStartsWith"', function() {
			it('should return false for a non-match', function(done) {
				var result = validationModule.fieldIsValid('textStartsWith', '123', '654 Some Numbers');
				result.should.be.false;
				done();
			});
			
			it('should return true for a match', function(done) {
				var result = validationModule.fieldIsValid('textStartsWith', 'John', 'Johnny Appleseed');
				result.should.be.true;
				done();
			})
		});
		
		describe('where validation type is "textEndsWith"', function() {
			it('should return false for a non-match', function(done) {
				var result = validationModule.fieldIsValid('textEndsWith', 'something', '654 Some Numbers');
				result.should.be.false;
				done();
			});
			
			it('should return true for a match', function(done) {
				var result = validationModule.fieldIsValid('textEndsWith', 'seed', 'Johnny Appleseed');
				result.should.be.true;
				done();
			})
		});
		
		describe('where validation type is "textContains"', function() {
			it('should return false for a non-match', function(done) {
				var result = validationModule.fieldIsValid('textContains', 'nothing', '654 Some Numbers');
				result.should.be.false;
				done();
			});
			
			it('should return true for a match', function(done) {
				var result = validationModule.fieldIsValid('textContains', 'Apple', 'Johnny Appleseed');
				result.should.be.true;
				done();
			})
		});
		
		describe('where validation type is "numberGreaterThan"', function() {
			it('should return false for a non-match', function(done) {
				var result = validationModule.fieldIsValid('numberGreaterThan', 1, 5);
				result.should.be.false;
				done();
			});
			
			it('should return true for a match', function(done) {
				var result = validationModule.fieldIsValid('numberGreaterThan', 5, 1);
				result.should.be.true;
				done();
			})
		});
		
		describe('where validation type is "numberLessThan"', function() {
			it('should return false for a non-match', function(done) {
				var result = validationModule.fieldIsValid('numberLessThan', 10, 9);
				result.should.be.false;
				done();
			});
			
			it('should return true for a match', function(done) {
				var result = validationModule.fieldIsValid('numberLessThan', 3, 4);
				result.should.be.true;
				done();
			})
		});
		
		describe('where validation type is "numberEqualTo"', function() {
			it('should return false for a non-match', function(done) {
				var result = validationModule.fieldIsValid('numberEqualTo', 50, 60);
				result.should.be.false;
				done();
			});
			
			it('should return true for a match', function(done) {
				var result = validationModule.fieldIsValid('numberEqualTo', 50, 50);
				result.should.be.true;
				done();
			})
		});
		
		describe('where validation type is "dateDayEquals"', function() {
			it('should return false for a non-match', function(done) {
				var result = validationModule.fieldIsValid('dateDayEquals', moment("1-1-2013"), moment("1-2-2013"));
				result.should.be.false;
				done();
			});
			
			it('should return true for a match', function(done) {
				var result = validationModule.fieldIsValid('dateDayEquals', moment("1-1-2013"), moment("1-1-2013"));
				result.should.be.true;
				done();
			})
		});
		
		describe('where validation type is "dateAfter"', function() {
			it('should return false for a non-match', function(done) {
				var result = validationModule.fieldIsValid('dateAfter', moment("1-10-2013"), moment("1-1-2013"));
				result.should.be.false;
				done();
			});
			
			it('should return true for a match', function(done) {
				var result = validationModule.fieldIsValid('dateAfter', moment("1-10-2013"), moment("1-20-2013"));
				result.should.be.true;
				done();
			})
		});
		
		describe('where validation type is "dateBefore"', function() {
			it('should return false for a non-match', function(done) {
				var result = validationModule.fieldIsValid('dateBefore', moment("1-1-2013"), moment("1-10-2013"));
				result.should.be.false;
				done();
			});
			
			it('should return true for a match', function(done) {
				var result = validationModule.fieldIsValid('dateBefore', moment("1-10-2013"), moment("1-2-2013"));
				result.should.be.true;
				done();
			})
		});
	});
	//
	// describe('when getting one feed by id', function() {
	// it('should return the expected feed', function(done) {
	// feedModule.get(feed1._id).then(function(feed) {
	// feed.name.should.equal(feed1.name);
	// }).done(done);
	// })
	// });
	//
	// describe('when archiving one feed by id', function() {
	// it('should set the archive bit', function(done) {
	// feedModule.archive(userId, feed2._id).then(function(feed) {
	// feed.archived.should.equal(true);
	// }).done(done);
	// })
	// });
	//
	// describe('when creating a feed', function() {
	// it('should create the feed in the database', function(done) {
	// feedModule.create(userId, "New Feed", org1._id).then(function(newFeed) {
	// database.collection("feeds").then(function(col) {
	// col.getById(newFeed._id).then(function(feedFromDatabase) {
	// feedFromDatabase.name.should.equal("New Feed");
	// feedFromDatabase.orgId.should.equal(org1._id.toString());
	// }).done(done);
	// });
	// });
	// });
	// });
	//
	// describe("when correcting the name of a feed", function() {
	// it("should update the name in the database", function(done) {
	// feedModule.correctName(userId, feed3._id, "corrected name").then(function(modifiedFeed) {
	// database.collection("feeds").then(function(col) {
	// col.getById(modifiedFeed._id).then(function(feedFromDatabase) {
	// feedFromDatabase.name.should.equal("corrected name");
	// }).done(done);
	// });
	// });
	// });
	// });
	//
	// describe("when adding a collection to a feed", function() {
	// it("should add the collection in the database", function(done) {
	// feedModule.addCollection(userId, feed2._id, "collection name").then(function(modifiedFeed) {
	// database.collection("feeds").then(function(col) {
	// col.getById(modifiedFeed._id).then(function(feedFromDatabase) {
	// feedFromDatabase.collections[0].name.should.equal("collection name");
	// feedFromDatabase.collections[0]._id.should.not.be.null;
	// }).done(done);
	// });
	// });
	// });
	// });
	//
	// describe("when adding a field to a collection", function() {
	// it("should add the field in the database", function(done) {
	// //feed3 is the one with an existing collection
	// feedModule.addField(userId, feed3._id, feed3.collections[0]._id, "field name", "number").then(function(modifiedFeed) {
	// database.collection("feeds").then(function(col) {
	// col.getById(modifiedFeed._id).then(function(feedFromDatabase) {
	// feedFromDatabase.collections[0].fields[0].name.should.equal("field name");
	// feedFromDatabase.collections[0].fields[0].dataType.should.equal("number");
	// feedFromDatabase.collections[0].fields[0]._id.should.not.be.null;
	// }).done(done);
	// });
	// });
	// });
	// });
	//
	// describe("when modifying a field", function() {
	// it("should change the field in the database", function(done) {
	// var feedId = feed1._id;
	// feedModule.addCollection(userId, feedId, "modifying a field test").then(function(modifiedFeed) {
	// var collection = modifiedFeed.collections[0];
	// feedModule.addField(userId, feedId, collection._id, "old field name").then(function(modifiedFeedWithField) {
	// var field = modifiedFeedWithField.collections[0].fields[0];
	//
	// feedModule.modifyField(userId, feedId, collection._id, field._id, "new name", "date").then(function(feedWithModifiedField) {
	// var modifiedField = feedWithModifiedField.collections[0].fields[0];
	//
	// modifiedField.name.should.equal("new name");
	// modifiedField.dataType.should.equal("date");
	//
	// }).done(done);
	// });
	// })
	// });
	// });
	//
	// describe("when adding a collection to a feed without a name", function() {
	// var nothing;
	// it("should throw an exception", function(done) {
	// feedModule.addCollection(userId, feed3._id, nothing).fail(function(err) {
	// err.should.equal("Validation error! Must include name when creating a collection.");
	// }).done(done);
	// });
	// });
})