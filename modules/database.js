'use strict';

var q      = require('q');
var mongo  = require('mongodb');
var conf   = require('../config')[process.env.NODE_ENV || 'development'];
var Server = mongo.Server;
var Db     = mongo.Db;
var BSON   = mongo.BSONPure;


var database = function() {
	var CollectionWithPromise = require('./database-collections');
	var db;

	var openDb = function(host, port, dbName) {
		var def = q.defer();
		var server = new Server(host, port, {
			auto_reconnect : true
		});

		db = new Db(dbName, server, {
			safe : false
		});
		db.open(function(err, db) {
			if (err) {
				def.reject(err);
			} else {
				if (conf.db.user) {
					db.authenticate(conf.db.user, conf.db.password, function(err) {
						if (err)
							return def.reject(err);
						def.resolve(db);
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


	// var getCollection = function(collectionName){
	// return this.currentDatabase.collection(collectionName);
	// };

	var isConn = false;
	var currentConn = null;
	return {
		isConnected : function() {
			return isConn;
		},
		get currentConnection() {
			return currentConn;
		},
		connect : function(host, port, dbName) {
			return openDb(host, port, dbName).then(function(db) {
				isConn = true;
				currentConn = db;
				return true;
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
};

module.exports = database();
