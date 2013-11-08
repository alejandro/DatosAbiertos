'use strict';

var validationModule = require('../modules/validation');
var auth = require('../auth');
var _ = require("underscore");

module.exports.init = function(app) {

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
			dataType: 'datetime'
		},
		{
			code: 'dateAfter',
			name: 'After',
			dataType: 'datetime'
		},
		{
			code: 'dateBefore',
			name: 'Before',
			dataType: 'datetime'
		}		
	];

	app.get('/validatorTypes/:dataType', auth.restrict, function(req, res) {
		feedModule.getAll().then(function(feeds) {
			var validators = _.filter(tempListOfValidators, function(v){return v.dataType===req.params.dataType});
			res.json(validators);
		});
	});
// 
	// app.get('/feeds/:id', auth.restrict, function(req, res) {
		// feedModule.get(req.params.id).then(function(feed) {
			// res.json(feed);
		// });
	// });
// 
	// app.post('/feeds/:feedId/collections', function(req, res) {
		// feedModule.addCollection(req.params.feedId, req.body.name).then(function() {
			// res.json({
				// status : 'ok'
			// });
		// });
	// });
// 
	app.post('/feeds/:feedId/collections/:collectionId/rules', function(req, res) {
		validationModule.addRule(req.params.feedId, req.params.collectionId, req.body.validatorType, req.body.value).then(function() {
			res.json({
				status : 'ok'
			});
		});
	});

	app.delete('/feeds/:feedId/collections/:collectionId/rules/:ruleId', function(req, res) {
		feedModule.removeRule(req.params.feedId, req.params.collectionId, req.params.ruleId).then(function() {
			res.json({
				status : 'ok'
			});
		});
	});
};
