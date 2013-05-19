"use strict";

var should = require("should");
var database = require("../modules/database.js");

before(function(done) {
	database.connect("DatosAbiertos_Test").done(function() {
		done();		
	});
});
