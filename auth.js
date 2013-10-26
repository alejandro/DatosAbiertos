'use strict';

var passport = require('passport');
var GoogleStrategy = require('passport-google').Strategy;
var BasicWithTokenStrategy = require('passport-http').BasicWithTokenStrategy;
var accounts = require('./modules/accounts');
var express = require('express');
var app = express();
var config = require('./config')[app.get('env')];
var orgs = require('./modules/orgs');
var _ = require('underscore');

passport.use(new BasicWithTokenStrategy(function(username, password, token, done) {

	orgs.getApplicationUser(token, username, password).then(function(user) {
		user = _.extend(user, {
			role : 'api'
		});
		done(null, user);
	}).fail(function(err) {
		//if err is not found, return done(null, false);
		done(null, false);
	});
}));

var getAccountByEmail = function(email, done) {
	return accounts.getByEmail(email).then(function(account) {
		account = _.extend(account, {
			role : 'admin'
		});
		done(null, account);
	});
};

function validateUser(identifier, profile, done) {
	var email = profile.emails[0].value;
	getAccountByEmail(email, done).fail(function(err) {
		if (err == 'not found') {
			console.log('### User not found. Creating... ');
			accounts.create(email, profile.displayName, profile.name.givenName, profile.name.familyName).then(function(newAccount) {
				console.log('### User created!');
				console.log(newAccount);
				newAccount = _.extend(newAccount, {
					role : 'admin'
				});
				done(null, newAccount);
			});
		}
	});
}

var googleAuthConfig = {
	returnURL : config.baseUrl + '/login/return',
	realm : config.baseUrl
};

passport.use(new GoogleStrategy(googleAuthConfig, validateUser));

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

function restrict(req, res, next) {
	var rejectRequest = function(message) {
		res.send({
			error : message
		}, 401);
	};

	if (req.isAuthenticated()) {
		next();
	} else {
		rejectRequest('Authentication required to access that feature.');
	}
}

function restrictRole(role) {
	return function(req, res, next) {

		var rejectRequest = function(message) {
			res.send({
				error : message
			}, 401);
		};

		if (req.isAuthenticated()) {
			if (!role || (req.user.role && req.user.role.indexOf(role) > -1)) {
				console.log("authorized request");
				next();
			} else {
				rejectRequest(role + ' role required to access that feature.');
			}
		} else {
			rejectRequest('Authentication required to access that feature.');
		}
	}
}

exports.authenticateWithGoogle = passport.authenticate('google', {
	failureRedirect : '/#/login?failure=yes',
	successRedirect : '/#/'
});

exports.authenticateWithUserAndToken = passport.authenticate('basicWithToken', {

});

exports.restrict = restrict;
exports.restrictRole = restrictRole;
exports.passport = passport;
