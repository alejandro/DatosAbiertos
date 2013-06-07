"use strict";

var q = require("q"), mongo = require('mongodb'), Server = mongo.Server, Db = mongo.Db, BSON = mongo.BSONPure;

var database = function() {

	var server = new Server('localhost', 27017, {
		auto_reconnect : true
	});

	var db;

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

	var newId = function(){
		return BSON.ObjectID();
	};
	
	var CollectionWithPromise = ( function() {

			var coll = null;

			function CollectionWithPromise(collection) {
				coll = collection;
			};

			var getById = function(id) {
				var def = q.defer();
				var bsonId;
				try {

					bsonId = new BSON.ObjectID(id.toString());
				} catch(err) {
					def.reject("There was a problem with the provided Id '" + id + "'. Cannot be converted to BSON Id.");
				}
				if (bsonId) {
					coll.findOne({
						'_id' : bsonId
					}, function(err, doc) {
						if (err) {
							def.reject(err);
						} else if (doc == null) {
							def.reject("Could not find the record with id " + id + ".");
						} else {
							def.resolve(doc);
						}
					});
				}
				return def.promise;
			};

			CollectionWithPromise.prototype.getById = function(id) {
				return getById(id);
			};

			CollectionWithPromise.prototype.modify = function(id, modification) {
				var def = q.defer();
				coll.update({
					_id : new BSON.ObjectID(id.toString())
				}, {$set: modification}, {
					upsert : false,
					safe : true
				}, function(err, recordsUpdate) {
					if (err) {
						def.reject(err);
					} else {
						getById(id).done(function(doc) {
							def.resolve(doc);
						});
					}
				});
				return def.promise;
			};

			CollectionWithPromise.prototype.remove = function(idOrQuery) {
				var def = q.defer();
				var query = idOrQuery;

				var isBsonObjectId = idOrQuery.toHexString;
				var isJsObject = idOrQuery.constructor == Object;

				if (isJsObject) {
					query = idOrQuery;
				} else if (isBsonObjectId) {
					query = {
						'_id' : idOrQuery
					}
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

			CollectionWithPromise.prototype.getFirst = function(query) {
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
								if (items.length > 0) {
									def.resolve(items[0]);
								} else {
									def.reject("not found");
								}
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
		newId: newId,
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
