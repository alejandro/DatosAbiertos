'use strict';

var q = require('q');
var mongo = require('mongodb');
var conf = require('../config')[process.env.NODE_ENV || 'development'];
var Server = mongo.Server;
var Db = mongo.Db;
var BSON = mongo.BSONPure;
var moment = require('moment');

var database = function() {

	var db;

	var openDb = function(host, port, dbName) {
		var server = new Server(host, port, {
			auto_reconnect : true
		});

		var def = q.defer();
		db = new Db(dbName, server, {
			safe : false
		});
		db.open(function(err, db) {
			if (err) {
				def.reject(err);
			} else {
				if (conf.db.user) {
					db.authenticate(conf.db.user, conf.db.password, function(err, replies) {
						if (err)
							return def.reject(err)
						def.resolve(db)
					});
				} else {
					def.resolve(db);
				}
			}
		});
		return def.promise;
	};

	var newId = function() {
		return BSON.ObjectID();
	};

	var getId = function(stringId) {
		return BSON.ObjectID(stringId);
	};

	var CollectionWithPromise = ( function() {

			function CollectionWithPromise(collection) {
				this.coll = collection;
			}

			var getById = function(id) {
				var def = q.defer();
				var bsonId;
				try {

					bsonId = new BSON.ObjectID(id.toString());
				} catch(err) {
					var msg = 'There was a problem with the provided Id "' + id + '." '
					msg += 'It cannot be converted to BSON Id.'
					def.reject(msg);
				}
				if (bsonId) {
					this.coll.findOne({
						'_id' : bsonId
					}, function(err, doc) {
						if (err) {
							def.reject(err);
						} else if (!doc) {
							def.reject('Could not find the record with id "' + id + '."');
						} else {
							def.resolve(doc);
						}
					});
				}
				return def.promise;
			};

			CollectionWithPromise.prototype.getById = function(id) {
				return getById.call(this, id);
			};

			CollectionWithPromise.prototype.modify = function(userId, id, modification) {
				var self = this;
				delete modification._id;

				var modSet = {
					$set : modification,
					$push : {
						history : {
							userId : userId,
							action : "modified",
							time : moment().valueOf(),
							changes : modification
						}
					}
				};

				return makeUpdate(self, id, modSet);
			};

			CollectionWithPromise.prototype.archive = function(userId, itemId) {
				var self = this;

				var modSet = {
					$set : {
						archived : true
					},
					$push : {
						history : {
							userId : userId,
							action : "archived",
							time : moment().valueOf()
						}
					}
				};

				return makeUpdate(self, itemId, modSet);
			};

			CollectionWithPromise.prototype.unarchive = function(userId, itemId) {
				var self = this;

				var modSet = {
					$set : {
						archived : false
					},
					$push : {
						history : {
							userId : userId,
							action : "unarchived",
							time : moment().valueOf()
						}
					}
				};

				return makeUpdate(self, itemId, modSet);
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
				this.coll.remove(query, {
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

			CollectionWithPromise.prototype.add = function(userId, item) {
				var def = q.defer();
				if ( typeof item === null) {
					def.reject('item is null');
				} else if ( typeof item === 'undefined') {
					def.reject('item is undefined');
				} else if ( typeof item !== 'object') {
					def.reject(JSON.stringify(item) + ' is not an object');
				} else if (Object.keys(item).length == 0) {
					def.reject('Cannot add an empty item.')
				} else {

					item.history = [{
						userId : new BSON.ObjectID(userId.toString()),
						action : "created",
						time : moment().valueOf()
					}];

					this.coll.insert(item, {
						safe : true
					}, function(err) {
						if (err) {
							def.reject(err);
						} else {
							def.resolve(item);
						}
					});
				}
				return def.promise;
			};

			CollectionWithPromise.prototype.getAll = function(query) {
				var def = q.defer();
				query = query || {};
				this.coll.find(query, function(err, cursor) {
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
				query = query || {};
				this.coll.find(query, function(err, cursor) {
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
									def.reject('not found');
								}
							}
						});
					}
				});
				return def.promise;
			};

			var makeUpdate = function(db, itemId, modSet) {
				var def = q.defer();
				db.coll.update({
					_id : new BSON.ObjectID(itemId.toString())
				}, modSet, {
					upsert : false,
					safe : true
				}, function(err, recordsUpdate) {
					if (err) {
						console.log(err);
						def.reject(err);
					} else {
						getById.call(db, itemId).done(function(doc) {
							def.resolve(doc);
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
		connect : function(host, port, dbName) {
			return openDb(host, port, dbName).then(function(db) {
				isConn = true;
				currentConn = db;
			});
		},
		newId : newId,
		getId : getId,
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
		drop : function(collectionName) {
			var def = q.defer();

			db.collection(collectionName, function(err, collection) {
				return collection.remove({}, function(err, removed) {
					def.resolve(removed);
				});
			});
			return def.promise;
		},

		//types
		CollectionWithPromise : CollectionWithPromise
	};
}();

module.exports = database;
