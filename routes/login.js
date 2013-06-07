var auth = require('../auth');

module.exports.init = function(app) {
	app.get('/login/google', auth.authenticateWithGoogle);
	
	app.get('/login/return', auth.authenticateWithGoogle, function(req, res) {
		res.redirect('/#/');
	});

	app.get('/login/check', auth.restrict, function(req, res){
		res.render("ok");
		res.end();
	});
	
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/#/login');
	});
};

