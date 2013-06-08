"use strict";

var passport = require('passport'), GoogleStrategy = require('passport-google').Strategy, accounts = require('./modules/accounts');
var config = require("./config");

var googleAuthConfig = {
	returnURL : config.baseUrl + '/login/return',
	realm : config.baseUrl
};

var strategy = new GoogleStrategy(googleAuthConfig, validateUser);

function validateUser(identifier, profile, done) {
	var email = profile.emails[0].value;
	getAccount(email, done).fail(function(err) {
		if (err == "not found") {
			console.log("### User not found. Creating... ");
			console.log(profile);
			accounts.create(email, profile.displayName, profile.name.givenName, profile.name.familyName).then(function(newAccount) {
				console.log("### User created!");
				console.log(newAccount);
				done(null, newAccount);
			});
		}
	});
};

passport.use(strategy);

passport.serializeUser(function(account, done) {
	done(null, account.email);
});

passport.deserializeUser(function(email, done) {
	getAccount(email, done);
});

function getAccount(email, done) {
	console.log("Getting account by email " + email + "...");			
	return accounts.getByEmail(email).then(function(account) {
		console.log("Got account!");
		console.log(account); //this works
		done(null, account);
	});
};

function restrict(req, res, next) {
	console.log("Auth'd: " + req.isAuthenticated());
	if (req.isAuthenticated() == true) {
		next();
	} else {	
		console.log("User is not authenticated.")
		console.log(req.user);
			
		res.send('Authentication required to access that feature.', 401);
	}
}

exports.authenticateWithGoogle = passport.authenticate("google", {
	failureRedirect : '/#/login?failure=yes',
	successRedirect : '/#/'
});
exports.restrict = restrict;
exports.passport = passport;
