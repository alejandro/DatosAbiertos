"use strict";

var mongo = require('mongodb');
var express = require('express');
var app = new express();
var database = require("./modules/database.js");
var auth = require('./auth');
var routes = require("./routes");
var mongoConnect = require('connect-mongodb');

console.log("Starting app...");

var dbHost = 'localhost';
var dbPort = 27017;
var dbName = "DatosAbiertos";

database.connect(dbHost, dbPort, dbName).then(function() {
	console.log("Database connected.");
	app.configure(function() {
		app.use(express.static(__dirname + '/public'));
		app.use(express.logger('dev'));
		app.use(express.bodyParser());
		app.set('port', process.env.PORT || 3000);
		app.use(express.cookieParser());
		console.log("Setting up mongoDB session mgt...");
		app.use(express.session({
			secret: "cafe el gringo",
			store: new mongoConnect({
				url: 'mongodb://' + dbHost + ':' + dbPort + '/' + dbName, 
              	maxAge: 300000
			})
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
