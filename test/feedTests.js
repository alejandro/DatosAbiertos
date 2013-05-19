"use strict";

var feedModule = require("../modules/feeds.js");
var should = require('chai').should();
var database = require("../modules/database.js");
var q = require("q");

describe('Feeds', function() {

	var feed1 = {archived: false, name: 'test1'};
	var feed2={archived: false, name: 'test2'};
	var feed3={archived: true, name: 'test3'};
	
	beforeEach(function(done) {
		database.collection("feeds").then(function(coll){
			coll.add(feed1)
			.then(function(){
				return coll.add(feed2);
			})
			.then(function(){
				return coll.add(feed3);
			});
		}).done(done);		
	});	
 
  	afterEach(function(done){
		database.currentConnection().collection("feeds", function(err, coll) {
				coll.remove({},{ safe: true}, done);
			});
	});

	describe('when getting a list of feeds', function() {
		it('should return a list of feeds', function(done) {
			feedModule.getAll().then(function(feeds) {
				feeds.length.should.equal(3);				
			}).done(done);
		})
	});
	
	describe('when getting one feed by id', function() {
		it('should return the expected feed', function(done) {
			feedModule.get(feed1._id).then(function(feed) {
				feed.name.should.equal(feed1.name);
			}).done(done);
		})
	});
	
	describe('when archiving one feed by id', function(){
		it('should set the archive bit', function(done){
			feedModule.archive(feed2._id).then(function(feed){
				feed.archived.should.equal(true);
			}).done(done);
		})
	});
	
	describe('when creating a feed', function(){
		it('should create the feed in the database', function(done){
			feedModule.create("New Feed").then(function(newFeed){
				database.collection("feeds").then(function(col){
					col.getById(newFeed._id).then(function(feedFromDatabase){
						feedFromDatabase.name.should.equal("New Feed");
					}).done(done);
				});
			});
		});
	});
	
	describe("when correcting the name of a feed", function(){
		it("should update the name in the database", function(done){
			feedModule.correctName(feed3._id, "corrected name").then(function(modifiedFeed){
				database.collection("feeds").then(function(col){
					col.getById(modifiedFeed._id).then(function(feedFromDatabase){
						feedFromDatabase.name.should.equal("corrected name");
					}).done(done);
				});
			});
		});
	});
})