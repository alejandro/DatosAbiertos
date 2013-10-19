'use strict';

var passport = require('passport');
var GoogleStrategy = require('passport-google').Strategy;
var accounts = require('./modules/accounts');
var express = require('express');
var app = express();
var config = require('./config')[app.get('env')];
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
	if (req.isAuthenticated()) {
		next();
	} else {
		var rejectRequest = function() {
			console.log('User is not authenticated.')
			res.send('Authentication required to access that feature.', 401);
		};
		//this is hacky. I think this should be something else, but I'll leave it to
		//someone who knows authentication/security better than I do.
		if (req.body.token) {
			console.log("Checking public API user.");
			orgs.getApplicationUser(req.body.token, req.body.username, req.body.password).then(function() {
				next()
			}).fail(function(err) {
				rejectRequest();
			});
		} else {
			rejectRequest();
		}
	}
}

exports.authenticateWithGoogle = passport.authenticate('google', {
	failureRedirect : '/#/login?failure=yes',
	successRedirect : '/#/'
});
exports.restrict = restrict;
exports.passport = passport;
