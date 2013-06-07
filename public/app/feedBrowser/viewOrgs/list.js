define(['feedBrowser/orgData', 'durandal/app'], function(orgData, app) {

	var viewModel = function(data) {

		var orgs = ko.observableArray();

		var loadOrgs = function() {
			orgs.removeAll();
			return data.getAll().done(function(orgsFromServer) {
				_.each(orgsFromServer, function(org) {
					orgs.push(org);
				});
			});
		};

		return {
			orgs : orgs,
			create : function() {
				app.showModal('feedBrowser/createOrg/create').then(function(newOrg) {
					loadOrgs();
				});
			},
			activate : function() {
				return loadOrgs();
			},
			viewAttached : function() {				
			}
		};

	}(orgData);

	return viewModel;
})
