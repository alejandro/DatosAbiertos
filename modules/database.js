var q = require("q"), mongo = require('mongodb'), Server = mongo.Server, Db = mongo.Db, BSON = mongo.BSONPure;

var database = function() {

	var server = new Server('localhost', 27017, {
		auto_reconnect : true
	});

	var openDb = function(dbName) {
		var def = q.defer();
		db = new Db(dbName, server, {
			safe : false
		});
		db.open(function(err, db) {
			if (err) {
				def.reject(err);
			} else {
				def.resolve(db);
			}
		});
		return def.promise;
	};

	var CollectionWithPromise = ( function() {

			var coll = null;

			function CollectionWithPromise(collection) {
				coll = collection;
			};

			var getById = function(id) {
				var def = q.defer();
				coll.findOne({
					'_id' : new BSON.ObjectID(id.toString())
				}, function(err, doc) {
					if (err) {
						def.reject(err);
					} else {
						def.resolve(doc);
					}
				});
				return def.promise;
			};

			CollectionWithPromise.prototype.getById = function(id) {
				return getById(id);
			};

			CollectionWithPromise.prototype.modify = function(id, modification) {
				var def = q.defer();
				coll.update({
					_id : new BSON.ObjectID(id.toString())
				}, modification, {
					upsert : false,
					safe : true
				}, function(err, recordsUpdate) {
					if (err) {
						def.reject(err);
					} else {
						getById(id).done(function(doc){
							def.resolve(doc);	
						});						
					}
				});
				return def.promise;
			};

			CollectionWithPromise.prototype.remove = function(idOrQuery) {
				var def = q.defer();
				var query = idOrQuery;
				if (idOrQuery.constructor == Object) {
					query = idOrQuery;
				} else {
					query = {
						'_id' : new BSON.ObjectID(idOrQuery.toString())
					}
				}
				coll.remove(query, {
					safe : true
				}, function(err) {
					if (err) {
						def.reject(err);
					} else {
						def.resolve();
					}
				});
				return def.promise;
			};

			CollectionWithPromise.prototype.add = function(item) {
				var def = q.defer();
				coll.insert(item, {
					safe : true
				}, function(err) {
					if (err) {
						def.reject(err);
					} else {
						def.resolve(item);
					}
				});
				return def.promise;
			};

			CollectionWithPromise.prototype.getAll = function(query) {
				var def = q.defer();
				var query = query || {};
				coll.find(query, function(err, cursor) {
					if (err) {
						def.reject(err);
					} else {
						cursor.toArray(function(err, items) {
							if (err) {
								def.reject(err);
							} else {
								def.resolve(items);
							}
						});
					}
				});
				return def.promise;
			};

			return CollectionWithPromise;
		}());
	// var getCollection = function(collectionName){
	// return this.currentDatabase.collection(collectionName);
	// };

	var isConn = false;
	var currentConn = null;
	return {
		isConnected : function() {
			return isConn;
		},
		currentConnection : function() {
			return currentConn;
		},
		connect : function(dbName) {
			return openDb(dbName).then(function(db) {
				isConn = true;
				currentConn = db;
			});
		},
		collection : function(collectionName) {
			var def = q.defer();
			db.collection(collectionName, function(err, coll) {
				if (err) {
					def.reject(err);
				} else {
					def.resolve(new CollectionWithPromise(coll));
				}
			});
			return def.promise;
		},

		//types
		CollectionWithPromise : CollectionWithPromise
	};
}();

module.exports = database;
