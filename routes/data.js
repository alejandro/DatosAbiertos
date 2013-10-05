"use strict";

var dataModule = require("../modules/collectionData");
var auth = require("../auth");

module.exports.init = function(app) {

	app.get('/collections/:collectionId/data', function(req, res) {
		dataModule.getAll(req.params["collectionId"]).then(function(data) {
			res.json(data);
		});
	});

	app.post('/collections/:collectionId/data', function(req, res) {
		dataModule.addData(req.params["collectionId"], req.body).then(function() {
			res.json({
				status : 'ok'
			});
		});
	});

	//
	// app.get('/feeds/:id', auth.restrict, function(req, res) {
	// feedModule.get(req.params["id"]).then(function(feed) {
	// res.json(feed);
	// });
	// });
	//
	//
	// app.post('/feeds/:feedId/collections/:collectionId/fields', function(req, res) {
	// console.log(req.body);
	// feedModule.addField(req.params["feedId"], req.params["collectionId"], req.body.name, req.body.dataType).then(function() {
	// res.json({
	// status : 'ok'
	// });
	// });
	// });
	//
	// app.put('/feeds/:feedId/collections/:collectionId/fields/:fieldId', function(req, res) {
	// feedModule.modifyField(req.params["feedId"], req.params["collectionId"], req.params["fieldId"], req.body.name, req.body.dataType).then(function() {
	// res.json({
	// status : 'ok'
	// });
	// });
	// });
};
