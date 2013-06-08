"use strict";

var should = require("should");
var database = require("../modules/database.js");

before(function(done) {
	database.connect('localhost', 27017, "DatosAbiertos_Test").done(function() {
		done();		
	});
});
