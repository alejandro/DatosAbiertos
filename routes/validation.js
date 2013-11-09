'use strict';

var validationModule = require('../modules/validation');
var documentModule = require('../modules/documents');
var auth = require('../auth');
var _ = require("underscore");

module.exports.init = function(app) {

	app.get('/validatorTypes/:dataType', auth.restrict, function(req, res) {
		validationModule.getAll(req.params.dataType).then(function(validators) {
			res.json(validators);
		});
	});

	app.post('/validation/feeds/:feedId/collections/:collectionId', function(req, res) {
		documentModule.validateNewDocument(req.params.feedId, req.params.collectionId, req.body).then(function(result) {
			res.json(result);
		});
	});

	app.put('/validation/feeds/:feedId/collections/:collectionId/documents/:documentId', function(req, res) {
		documentModule.validateModifications(req.params.feedId, req.params.collectionId, req.params.documentId, req.body).then(function(result) {
			res.json(result);
		});
	});

	app.post('/feeds/:feedId/collections/:collectionId/rules', function(req, res) {
		validationModule.addRule(req.params.feedId, req.params.collectionId, req.body.validatorType, req.body.value).then(function() {
			res.json({
				status : 'ok'
			});
		});
	});

	app.
	delete ('/feeds/:feedId/collections/:collectionId/rules/:ruleId',
	function(req, res) {
		feedModule.removeRule(req.params.feedId, req.params.collectionId, req.params.ruleId).then(function() {
			res.json({
				status : 'ok'
			});
		});
	});
};
