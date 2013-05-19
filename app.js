"use strict";

var mongo = require('mongodb');
var express = require('express');
var app = new express();
var database = require("./modules/database.js");
var auth = require('./auth');
var routes = require("./routes");

console.log("Starting app...");
database.connect("DatosAbiertos").then(function() {
	console.log("Database connected.");
	app.configure(function() {
		app.use(express.static(__dirname + '/public'));
		app.use(express.logger('dev'));
		app.set('port', process.env.PORT || 3000);
		app.use(express.cookieParser());
		app.use(express.session({
			secret : 'cafe el gringo'
		}));
		app.use(auth.passport.initialize());
		app.use(auth.passport.session());
	});
	console.log("App configured.");

	routes.init(app);
	console.log("Routes initialized.");
	
	app.listen(app.get('port'), function() {
		console.log("DatosAbiertos API Server listening on port " + app.get('port'));
	});
});
