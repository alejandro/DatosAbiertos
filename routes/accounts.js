'use strict';

var auth = require('../auth');
var accounts = require('../modules/accounts');

module.exports.init = function(app) {
	app.get('/login/google', auth.authenticateWithGoogle);

	app.get('/login/return', auth.authenticateWithGoogle, function(req, res) {
		res.redirect('/#/');
	});

	app.get('/login/check', auth.restrict, function(req, res) {
		res.end();
	});

	app.get('/accounts/search/:text', auth.restrict, function(req, res) {
		accounts.search(req.params.text).done(function(matches) {
			res.json(matches);
		})
	});

	app.get('/accounts/me', auth.restrict, function(req, res) {
		res.json(req.user);
	});

	app.get('/api/auth', auth.authenticateWithUserAndToken, function(req, res) {
		res.json(req.user);
	});

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/#/login');
	});
};

