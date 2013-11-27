'use strict';

var mod  = require('../modules/collections');

module.exports.init = function(app) {

	app.get('/collections', function(req, res) {
		mod.getAll().then(function(collections) {
			res.json(collections);
		});
	});

	app.get('/feeds/:feedId/collections/code/:code', function(req, res) {
		mod.getByCode(req.params.feedId, req.params.code).then(function(collection){
			res.json(collection);
		}).fail(function(){
			res.json({message: 'Not Found'}, 404);
		});
	});
};
