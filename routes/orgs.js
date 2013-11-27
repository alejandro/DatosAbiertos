'use strict';

var orgModule = require('../modules/orgs');
var feedModule = require('../modules/feeds');
var accountModule = require('../modules/accounts');
var auth = require('../auth');
var _ = require('underscore');

module.exports.init = function(app) {

	app.get('/orgs/:orgCodeOrId', auth.restrict, function(req, res) {
		var codeOrId = req.params.orgCodeOrId;
		if (codeOrId.length == 24) {
			orgModule.getById(codeOrId).then(function(org) {
				res.json(org);
			}).fail(function(err){
				res.json("{message:'Not found'}", 404);
			});
		} else {
			orgModule.getByCode(codeOrId).then(function(org) {
				res.json(org);
			}).fail(function(err){
				res.json("{message:'Not found'}", 404);
			});
		}
	});

	app.get('/orgs', auth.restrict, function(req, res) {
		accountModule.getByEmail(req.user.email).then(function(account) {
			orgModule.getAllForAccount(account._id).then(function(orgs) {
				res.json(orgs);
			});
		});
	});

	var returnFeeds = function(org, req, res) {
		feedModule.getAllByOrgId(org._id).then(function(feeds) {
			res.json(feeds);
		});
	};
	app.get('/:orgCode/feeds', auth.restrict, function(req, res) {
		orgModule.getByCode(req.params.orgCode).then(function(org) {
			returnFeeds(org, req, res);
		});
	});
	app.get('/orgs/:orgId/feeds', auth.restrict, function(req, res) {
		returnFeeds({_id: req.params.orgId}, req, res);
	});

	var returnAdmins = function(org, req, res) {
		var adminIds = _.filter(org.admins || [], function(admin) {
			return admin;
		});
		accountModule.getByIds(adminIds).then(function(admins) {
			res.json(admins);
		});
	};
	app.get('/:orgCode/admins', auth.restrict, function(req, res) {
		orgModule.getByCode(req.params.orgCode).then(function(org) {
			returnAdmins(org, req, res);
		});
	});
	app.get('/orgs/:orgId/admins', auth.restrict, function(req, res) {
		orgModule.getById(req.params.orgId).then(function(org) {
			returnAdmins(org, req, res);
		});
	});

	app.
	delete ('/orgs/:orgId/admins/:adminId', auth.restrict,
	function(req, res) {
		orgModule.removeAdminUser(req.user._id, req.params.orgId, req.params.adminId).then(function(org) {
			res.json({
				status : 'ok'
			});
		});
	});

	app.post('/orgs/:orgId/feeds', auth.restrict, function(req, res) {
		feedModule.create(req.user._id, req.body.name, req.params.orgId).done(function() {
			res.json({
				status : 'ok'
			});
		});
	});

	app.post('/orgs', auth.restrict, function(req, res) {
		orgModule.create(req.user._id, req.body.name, req.body.code, req.user._id).done(function() {
			res.json({
				status : 'ok'
			});
		});
	});

	app.put('/orgs/:orgId/code', auth.restrict, function(req, res) {
		orgModule.changeCode(req.user._id, req.params.orgId, req.body.code).done(function() {
			res.json({
				status : 'ok'
			});
		});
	});

	app.post('/orgs/:orgId/applications', auth.restrict, function(req, res) {
		orgModule.addApplication(req.user._id, req.params.orgId, req.body.name).then(function() {
			res.json({
				status : 'ok'
			});
		});
	});

	app.post('/orgs/:orgId/applications/:appId/users', auth.restrict, function(req, res) {
		orgModule.addApplicationUser(req.user._id, req.params.orgId, req.params.appId, req.body).then(function() {
			res.json({
				status : 'ok'
			});
		});
	});

	app.post('/orgs/:orgId/admins', auth.restrict, function(req, res) {
		console.log(req.params);
		console.log(req.body);
		orgModule.addAdminUser(req.user._id, req.params.orgId, req.body.userId).then(function() {
			res.json({
				status : 'ok'
			});
		});
	});

	app.put('/orgs/:orgId/applications/:appId/users/:userId', auth.restrict, function(req, res) {
		orgModule.modifyApplicationUser(req.user._id, req.params.orgId, req.params.appId, req.params.userId, req.body).then(function() {
			res.json({
				status : 'ok'
			});
		});
	});

    app.delete('/orgs/:id', function(req, res){
        orgModule.archive(req.user._id, req.params.id).then(function(){

            res.json({
                status: 'ok'
            });
        });

    });
};
