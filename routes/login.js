'use strict';

var auth = require('../auth');

module.exports.init = function(app) {
	app.get('/login/google', auth.authenticateWithGoogle);
	
	app.get('/login/return', auth.authenticateWithGoogle, function(req, res) {
		console.log('Redirecting to "/#/"...');
		res.redirect('/#/');
	});

	app.get('/login/check', auth.restrict, function(req, res){
		res.end();
	});
	
	app.get('/api/auth', auth.authenticateWithUserAndToken, function(req, res){
		res.json(req.user);	
	});
	
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/#/login');
	});
};

