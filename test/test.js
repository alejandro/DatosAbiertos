'use strict';

var database = require('../modules/database.js');

before(function(done) {
	database.connect('localhost', 27017, 'DatosAbiertos_Test').done(function() {
		done();
	});
});

process.on('uncaughtException', function(err) {
	//console.log(err);
	//console.error(new Date().toUTCString() + ' uncaughtException:', err.message);
	//console.error(err.stack);
	//process.exit(1);
});