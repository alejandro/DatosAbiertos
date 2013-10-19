'use strict';

var express      = require('express');
var mongoConnect = require('connect-mongodb');

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
		console.log('Setting up mongoDB session mgt...');
		app.use(express.session({
			secret: 'cafe el gringo',
			cookie : {
				maxAge: 300000
			},
			store: new mongoConnect({
				url: 'mongodb://' + cfg.db.host + ':' + cfg.db.port + '/' + cfg.db.name
			})
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
