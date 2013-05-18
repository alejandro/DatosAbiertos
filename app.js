var mongo = require('mongodb');
var express = require('express');
var app = new express();
var database = require("../modules/database.js");

DEBUG = "monk:*"
//DEBUG="monk:queries"

app.configure(function() {
	app.use(express.static(__dirname + '/public'));
	app.use(express.logger('dev'));
	app.set('port', process.env.PORT || 3000);
});

app.get('/', function(req, res) {
	db.driver.admin.listDatabases(function(e, dbs) {
		res.json(dbs);
	});
});

var feedModule = require("./modules/feeds");

app.get('/feeds', function(req, res) {
	feedModule.getAll().success(function(feeds) {
		res.json(feeds);
	}).error(function(err) {
		res.json({
			Err : err
		});
	});
});

app.get('/feeds/:id', function(req, res) {

});

database.connect("DatosAbiertos").then(function() {
	app.listen(app.get('port'), function() {
		console.log("DatosAbiertos API Server listening on port " + app.get('port'));
	});
});
