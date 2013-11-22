'use strict';

var routes = function() {

	var feeds = require('./feeds');
	var validation = require('./validation');
	var orgs = require('./orgs');
	var documents = require('./documents');
	var collections = require('./collections');
	var accounts = require('./accounts');

	return {
		init : function(app) {

			console.log('Initializing feeds routes...');
			feeds.init(app);

			console.log('Initializing validation routes...');
			validation.init(app);

			console.log('Initializing orgs routes...');
			orgs.init(app);

			console.log('Initializing account routes...');
			accounts.init(app);

			console.log('Initializing document routes...');
			documents.init(app);

			console.log('Initializing collection routes...');
			collections.init(app);

		},
		feeds : feeds,
		orgs : orgs,
		accounts : accounts,
		documents : documents,
		validation : validation
	}
}();

module.exports = routes;
