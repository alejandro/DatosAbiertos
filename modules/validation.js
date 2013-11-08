'use strict';

var database = require('../modules/database.js');
var q        = require('q');
var _        = require('underscore');
var feeds    = 'feeds';

var mod = function() {

var tempListOfValidators = [
		{
			code: 'numberGreaterThan',
			name: 'Greater Than',
			dataType: 'number'
		},
		{
			code: 'numberLessThan',
			name: 'Less Than',
			dataType: 'number'
		},
		{
			code: 'numberEqualTo',
			name: 'Equals',
			dataType: 'number'
		},
		{
			code: 'textEqualTo',
			name: 'Is',
			dataType: 'text'
		},
		{
			code: 'textStartsWith',
			name: 'Starts With',
			dataType: 'text'
		},
		{
			code: 'textEndsWith',
			name: 'Ends With',
			dataType: 'text'
		},
		{
			code: 'dateDayEquals',
			name: 'On',
			dataType: 'date'
		},
		{
			code: 'dateAfter',
			name: 'After',
			dataType: 'date'
		},
		{
			code: 'dateBefore',
			name: 'Before',
			dataType: 'date'
		}		
	];
	
	var getCollection = function() {
		return database.collection(feeds);
	};

	var getAll = function(dataType) {
		var validators = _.filter(tempListOfValidators, function(v){return v.dataType===dataType});
		var def = q.defer();
		def.resolve(validators);
		return def.promise;
	};

	return {
		getAll : getAll,
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
