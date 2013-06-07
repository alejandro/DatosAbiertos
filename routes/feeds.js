"use strict";

var feedModule = require("../modules/feeds");
var auth = require("../auth");

module.exports.init = function(app) {

	app.get('/feeds', auth.restrict, function(req, res) {
		feedModule.getAll().then(function(feeds) {
			res.json(feeds);
		});
	});

	app.get('/feeds/:id', auth.restrict, function(req, res) {
		feedModule.get(req.params["id"]).then(function(feed) {
			res.json(feed);
		});
	});

	app.post('/feeds/:feedId/collections', function(req, res) {
		feedModule.addCollection(req.params["feedId"], req.body.name).then(function() {
			res.json({
				status : 'ok'
			});
		});
	});
};
