"use strict";

var passport = require('passport'), GoogleStrategy = require('passport-google').Strategy, accounts = require('./modules/accounts');
var config = require("./config");

var strategy = new GoogleStrategy({
	returnURL : config.baseUrl + '/login/return',
	realm : config.baseUrl
}, login);

passport.use(strategy);

passport.serializeUser(function(account, done) {
	done(null, account.email);
});

passport.deserializeUser(function(email, done) {
	accounts.getByEmail(email).then(function(account) {
		done(null, account);
	});
});

function login(identifier, profile, done) {
	var email = profile.emails[0].value;
	accounts.getByEmail(email).then(function(account) {
		done(null, account);
	});
}

function restrict(req, res, next) {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.redirect('/#/login');
	}
}

exports.authenticateWithGoogle = passport.authenticate("google", {
	failureRedirect : '/#/login?failure=yes',
	successRedirect : '/#/'
});
exports.restrict = restrict;
exports.passport = passport; 