'use strict';

var express      = require('express');
var app          = express();
var database     = require('./modules/database.js');
var auth         = require('./auth');
var routes       = require('./routes');
var cfg          = require('./config')[app.get('env')];

console.log('Starting app...');

database.connect(cfg.db.host, cfg.db.port, cfg.db.name).then(function() {
	console.log('Database connected.');
	app.configure(function() {
		app.use(express.static(__dirname + '/public'));
		app.use(express.logger('dev'));
		app.use(express.bodyParser());
		app.set('port', cfg.port);
		app.use(express.cookieParser());
		app.use(express.cookieSession({
			secret: 'cafe el gringo'
		}));
		app.use(auth.passport.initialize());
		app.use(auth.passport.session());
	});
	console.log('App configured.');

	routes.init(app);
	console.log('Routes initialized.');

	app.listen(app.get('port'), function() {
		console.log('DatosAbiertos API Server listening on port %d', this.address().port);
	});
});

process.on('uncaughtException', function (err) {
  console.error(new Date().toUTCString() + ' uncaughtException:', err.message);
  console.error(err.stack);
  process.exit(1);
});

