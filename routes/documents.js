'use strict';

var dataModule = require('../modules/documents');
var auth = require('../auth');
var url = require("url");
var queryString = require("querystring");

module.exports.init = function(app) {

	app.get('/collections/:collectionId/documents', function(req, res) {
		var theUrl = url.parse(req.url);
		var queryObj = queryString.parse(theUrl.query);
		var query;
		if (queryObj.query)
			query = JSON.parse(queryObj.query);
		//need json validation here to return a helpful message in case the json is malformed.
		dataModule.getAll(req.params.collectionId, query).then(function(documents) {
			res.json(documents);
		});
	});

	app.post('/collections/:collectionId/documents', auth.restrict, function(req, res) {
		dataModule.addData(req.params.collectionId, req.body).then(function() {
			res.json({
				status : 'ok'
			});
		}).fail(function(err) {
			res.json({
				error : err
			}, 405);
		});
	});

	app.delete ('/collections/:collectionId/documents/:documentId', auth.restrict,
	function(req, res) {
		dataModule.archiveDocument(req.params.collectionId, req.params.documentId).then(function() {
			res.json({
				status : 'ok'
			});
		})
	});

	app.put('/collections/:collectionId/documents/:documentId', auth.restrict, function(req, res) {
		dataModule.modify(req.params['collectionId'], req.params['documentId'], req.body).then(function() {
			res.json({
				status : 'ok'
			});
		});
	});

};
