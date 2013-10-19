"use strict";

var database = require("../modules/database.js");
var should = require('chai').should();
var q = require("q");

describe('Database', function() {

	describe('when connecting to the database', function() {
		it('should connect successfully', function() {			
			database.isConnected().should.be.true;	
			database.currentConnection.should.be.a('function');																	
		});
	});
	
	describe('when retrieving collection data', function(){
		
		var col = null;
		var john = { Name: "John", Age: 56 };
		var sam = { Name: "Sam", Age: 23 };
		var eva = { Name: "Eva", Age: 32 };
		
		beforeEach(function(done){
			database.collection("test").then(function(c){ 
				col = c;						
								
				database.currentConnection().collection("test", function(err, coll) {
					coll.insert([john, sam, eva ],{ safe: true}, done);
				});
			});	
		});
		
		afterEach(function(done){
			database.currentConnection().collection("test", function(err, coll) {
					coll.remove({},{ safe: true}, done);
				});
		});
		
		it('should use a collection with a promise', function(){
			col.should.be.an.instanceOf(database.CollectionWithPromise);				
		});
		
		it('should be able to retrieve all records', function(done){
			col.getAll().then(function(all){
				all.should.be.an.instanceOf(Array);
				all.length.should.equal(3);				
			}).done(done);
		});
		
		it('should be able to retrieve all records that match', function(done){
			col.getAll({Name:john.Name}).then(function(all){
				all.should.be.an.instanceOf(Array);
				all.length.should.equal(1);
				all[0].Name.should.equal(john.Name);				
			}).done(done);
		});
		
		it('should be able to retrieve the first record that matches', function(done){
			col.getFirst({Name:john.Name}).then(function(first){
				first.Name.should.equal(john.Name);				
			}).done(done);
		});
		
		it('should fail if it cannot find the first record that matches', function(done){
			col.getFirst({Name:"some other name"}).fail(function(err){
				err.should.equal("not found");
			}).done(done);
		});
		
		it('should be able to retrieve a record by id', function(done){
			col.getById(john._id).then(function(item){
				item._id.toString().should.equal(john._id.toString());
				item.Name.should.equal(john.Name);
			}).done(done);
		});
		
		it('should fail if the given id is invalid', function(done){
			var invalidId = "some invalid id";
			col.getById(invalidId).fail(function(err){
				err.should.equal('There was a problem with the provided Id "' + invalidId + '." It cannot be converted to BSON Id.');
			}).done(done);				
		});
		
		it('should fail if it cant find an item by the given id', function(done){
			var bson = require('mongodb').BSONPure;
			var nonExistentId = new bson.ObjectID();
			col.getById(nonExistentId).fail(function(err){
				err.should.equal('Could not find the record with id "' + nonExistentId + '."');
			}).done(done);				
		});
		
		it('should fail if user attempts to add an empty item', function(done){
			col.add({}).fail(function(err){
				err.should.equal('Cannot add an empty item.');
			}).done(done);
		});
		
		it('should be able to add an item', function(done){
			col.add({Name:"David"}).then(function(createdItem){
				createdItem._id.should.not.be.null;
				createdItem.Name.should.equal("David");
				col.getById(createdItem._id).then(function(itemInDatabase){
					itemInDatabase._id.toString().should.equal(createdItem._id.toString());
					itemInDatabase.Name.should.equal(createdItem.Name);
				}).done(done);
			});
		});
		
		it('should be able to remove an item by string id', function(done){
			col.remove(john._id.toString()).then(function(removedItem){
				col.getById(john._id).fail(function(err){
					err.should.equal('Could not find the record with id "' + john._id.toString() + '."');
				}).done(done);
			});
		});
		
		it('should be able to remove an item by BSON id', function(done){
			col.remove(john._id).then(function(removedItem){
				col.getById(john._id).fail(function(err){
					err.should.equal('Could not find the record with id "' + john._id.toString() + '."');
				}).done(done);
			});
		});
		
		it('should be able to remove items by query', function(done){
			col.remove({Name:sam.Name}).then(function(removedItem){
				col.getById(sam._id).fail(function(err){
					err.should.equal('Could not find the record with id "' + sam._id.toString() + '."');
				}).done(done);
			});
		});
		
		it('should be able to modify an item by id', function(done){
			col.modify(eva._id, {Name: "Eva Modified"}).then(function(modifiedItem){
				col.getById(eva._id).then(function(itemInDatabase){
					itemInDatabase.Name.should.equal("Eva Modified");
					itemInDatabase.Age.should.equal(eva.Age);
				}).done(done);
			});
		});
		
		it('should be able to provide a new unique database id', function(){
			database.newId().should.not.be.null;				
		});
		
		it('should be able to insert to different collections in the same instance', function(done){
			var fruit = {name:"apple"};
			var vehicle = {type:"truck"};
			
			//add to fruits collection
			database.collection("fruits").then(function(f_coll){
				return f_coll.add(fruit);
			
			}).then(function(){
					
				//add to vehicles collection
				return database.collection("vehicles").then(function(v_coll){					
					return v_coll.add(vehicle);
				});
				
			}).then(function(){
				var def = q.defer();	
				database.currentConnection().collection("vehicles", function(err, coll) {			
					coll.findOne({ '_id' : vehicle._id }, function(err, doc) {
							doc.type.should.equal(vehicle.type);
							def.resolve();
						});
				});
				return def.promise;
			
			}).then(function(){
				var def = q.defer();	
				database.currentConnection().collection("fruits", function(err, coll) {			
					coll.findOne({ '_id' : fruit._id }, function(err, doc) {
							doc.name.should.equal(fruit.name);
							def.resolve();
						});
				});
				return def.promise;
			}).then(done);
			
		});
		
		
	});	
});