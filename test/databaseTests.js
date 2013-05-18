var database = require("../modules/database.js");
var should = require('chai').should();

describe('Database', function() {

	describe('when connecting to the database', function() {
		it('should connect successfully', function() {			
			database.isConnected().should.be.true;	
			database.currentConnection.should.be.a('function');																		
		});
	});
	
	describe('when retrieving collection data', function(){
		
		var col = null;
		var john = { Name: "John"};
		var sam = { Name: "Sam" };
		var eva = { Name: "Eva" };
		
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
		
		it('should be able to retrieve a record by id', function(done){
			col.getById(john._id).then(function(item){
				item._id.toString().should.equal(john._id.toString());
				item.Name.should.equal(john.Name);
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
		
		it('should be able to remove an item by id', function(done){
			col.remove(john._id).then(function(removedItem){
				col.getById(john._id).then(function(itemInDatabase){
					(itemInDatabase==null).should.be.true;
				}).done(done);
			});
		});
		
		it('should be able to remove items by query', function(done){
			col.remove({Name:sam.Name}).then(function(removedItem){
				col.getById(sam._id).then(function(itemInDatabase){
					(itemInDatabase==null).should.be.true;
				}).done(done);
			});
		});
		
		it('should be able to modify an item by id', function(done){
			col.modify(eva._id, {Name: "Eva Modified"}).then(function(modifiedItem){
				col.getById(eva._id).then(function(itemInDatabase){
					itemInDatabase.Name.should.equal("Eva Modified");
				}).done(done);
			});
		});
	});	
});