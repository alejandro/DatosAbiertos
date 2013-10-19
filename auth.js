'use strict';

var passport = require('passport');
var GoogleStrategy = require('passport-google').Strategy;
var accounts = require('./modules/accounts');
var config = require('./config');
var orgs = require('./modules/orgs');
var googleAuthConfig = {
	returnURL : config.baseUrl + '/login/return',
	realm : config.baseUrl
};

var strategy = new GoogleStrategy(googleAuthConfig, validateUser);

function validateUser(identifier, profile, done) {
	var email = profile.emails[0].value;
	getAccount(email, done).fail(function(err) {
		if (err == 'not found') {
			console.log('### User not found. Creating... ');
			console.log(profile);
			accounts.create(email, profile.displayName, profile.name.givenName, profile.name.familyName).then(function(newAccount) {
				console.log('### User created!');
				console.log(newAccount);
				done(null, newAccount);
			});
		}
	});
}

passport.use(strategy);

passport.serializeUser(function(account, done) {
	done(null, account.email);
});

passport.deserializeUser(function(email, done) {
	getAccount(email, done);
});

function getAccount(email, done) {
	console.log('Getting account by email %s...', email);
	return accounts.getByEmail(email).then(function(account) {
		console.log('Got account!');
		console.log(account);
		//this works
		done(null, account);
	});
}

function restrict(req, res, next) {

	var unauthorized = function() {
		console.log('User is not authenticated.')
		res.send('Authentication required to access that feature.', 401);
	};

	if (req.isAuthenticated()) {
		next();
	} else {
		//possibly logging in via application token and applicatin user creds
		if (req.body.token && req.body.username && req.body.password && orgs.isValidAppUser(req.body.token, req.body.username, req.body.password)) {
			next();
		} else
			unauthorized();
	}
}

exports.authenticateWithGoogle = passport.authenticate('google', {
	failureRedirect : '/#/login?failure=yes',
	successRedirect : '/#/'
});
exports.restrict = restrict;
exports.passport = passport;
