'use strict';
var q      = require('q');
var mongo  = require('mongodb');
var BSON   = mongo.BSONPure;
var moment = require('moment');

module.exports =  CollectionWithPromise;


function CollectionWithPromise(collection) {
  this.coll = collection;
}

CollectionWithPromise.prototype.getById = function(id) {
  var def = q.defer();
  var bsonId;
  process.nextTick(function(){
   
    try {
      bsonId = new BSON.ObjectID(id.toString());
    } catch(err) {
      var msg = 'There was a problem with the provided Id "' + id + '." '
      msg += 'It cannot be converted to BSON Id.'
      return def.reject(msg);
    }

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
  }.bind(this));
  return def.promise;
};

CollectionWithPromise.prototype.modify = function(userId, id, modification) {
  var self = this;
  delete modification._id;

  var modSet = {
    $set : modification,
    $push : {
      history : {
        userId : userId,
        action : 'modified',
        time : moment().valueOf(),
        changes : modification
      }
    }
  };

  return self.makeUpdate(id, modSet);
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
        action : 'archived',
        time : moment().valueOf()
      }
    }
  };

  return self.makeUpdate(itemId, modSet);
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
        action : 'unarchived',
        time : moment().valueOf()
      }
    }
  };

  return self.makeUpdate(itemId, modSet);
};

CollectionWithPromise.prototype.remove = function(idOrQuery) {
  var def            = q.defer();
  var query          = idOrQuery;
  var isBsonObjectId = idOrQuery.toHexString;
  var isJsObject     = idOrQuery.constructor == Object;

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
  } else if (Object.keys(item).length === 0) {
    def.reject('Cannot add an empty item.')
  } else {

    item.history = [{
      userId : new BSON.ObjectID(userId.toString()),
      action : 'created',
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

CollectionWithPromise.prototype.makeUpdate = function(itemId, modSet) {
  var self = this;
  var def = q.defer();
  this.coll.update({
    _id : new BSON.ObjectID(itemId.toString())
  }, modSet, {
    upsert : false,
    safe : true
  }, function(err, _) {
    if (err) {
      console.log(err);
      def.reject(err);
    } else {
      self.getById(itemId).done(function(doc) {
        def.resolve(doc);
      });
    }
  });
  return def.promise;
};
    
