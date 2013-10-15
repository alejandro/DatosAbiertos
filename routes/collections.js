'use strict';

var mod  = require('../modules/collections');
var auth = require('../auth');

module.exports.init = function(app) {

	app.get('/collections', function(req, res) {
		mod.getAll().then(function(collections) {
			res.json(collections);
		});
	});
};
