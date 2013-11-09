'use strict';

var database = require('../modules/database.js');
var q = require('q');
var _ = require('underscore');
var feeds = 'feeds';
var moment = require('moment');

var mod = function() {

	var DEFAULT_MESSAGE = "Invalid";

	var tempListOfValidators = [{
		code : 'numberGreaterThan',
		name : 'Greater Than',
		dataType : 'number',
		validate : function(ruleValue, actualValue) {
			return ruleValue > actualValue;
		}
	}, {
		code : 'numberLessThan',
		name : 'Less Than',
		dataType : 'number',
		validate : function(ruleValue, actualValue) {
			return ruleValue < actualValue;
		}
	}, {
		code : 'numberEqualTo',
		name : 'Equals',
		dataType : 'number',
		validate : function(ruleValue, actualValue) {
			return ruleValue === actualValue;
		}
	}, {
		code : 'textEqualTo',
		name : 'Is',
		dataType : 'text',
		validate : function(ruleValue, actualValue) {
			return ruleValue === actualValue;
		}
	}, {
		code : 'textStartsWith',
		name : 'Starts With',
		dataType : 'text',
		validate : function(ruleValue, actualValue) {
			return actualValue.indexOf(ruleValue) == 0;
		}
	}, {
		code : 'textEndsWith',
		name : 'Ends With',
		dataType : 'text',
		validate : function(ruleValue, actualValue) {
			return actualValue.indexOf(ruleValue, actualValue.length - ruleValue.length) !== -1;
		}
	}, {
		code : 'textContains',
		name : 'Contains',
		dataType : 'text',
		validate : function(ruleValue, actualValue) {
			return actualValue.indexOf(ruleValue) > -1;
		}
	}, {
		code : 'dateDayEquals',
		name : 'On',
		dataType : 'date',
		validate : function(ruleValue, actualValue) {
			return moment(ruleValue).date()===moment(actualValue).date();
		}
	}, {
		code : 'dateAfter',
		name : 'After',
		dataType : 'date',
		validate : function(ruleValue, actualValue) {
			return moment(ruleValue).date()<moment(actualValue).date();
		}
	}, {
		code : 'dateBefore',
		name : 'Before',
		dataType : 'date',
		validate : function(ruleValue, actualValue) {
			return moment(ruleValue).date()>moment(actualValue).date();
		}
	}];

	var getCollection = function() {
		return database.collection(feeds);
	};

	var getAll = function(dataType) {
		var validators = _.filter(tempListOfValidators, function(v) {
			return v.dataType === dataType
		});
		var def = q.defer();
		def.resolve(validators);
		return def.promise;
	};

	var fieldIsValid = function(ruleCode, ruleValue, docFieldValue) {
		var validatorType = _.find(tempListOfValidators, function(v) {
			return v.code == ruleCode;
		});

		if (!validatorType) {
			throw new Error("The validator type code '" + ruleCode + "' does not have a registered validator.");
		}

		return validatorType.validate(ruleValue, docFieldValue);
	};

	var validateDocument = function(feedId, collectionId, doc) {
		var def = q.defer();
		getCollection().then(function(coll) {
			coll.getById(feedId).then(function(feed) {

				var collection = _.find(feed.collections, function(c) {
					return c._id.toString() == collectionId.toString();
				});

				var results = [];

				_.each(collection.fields, function(field) {

					_.each(field.rules, function(rule) {

						if (!fieldIsValid(rule.code, rule.value, doc[field.name])) {
							var validationResult = {
								field : field.name,
								message : rule.message || DEFAULT_MESSAGE
							};
							results.push(validationResult);
						}
					});
				});
				def.resolve(results);

			});
		});
		return def.promise;
	};

	return {
		getAll : getAll,
		validateDocument : validateDocument,
		fieldIsValid : fieldIsValid
		//getAllByOrgId : getAllByOrgId,
		// get : getOne,
		// archive : archive,
		// create : create,
		// correctName : correctName,
		// addCollection : addCollection,
		// addField : addField,
		// modifyField : modifyField
	};
}();

module.exports = mod;
