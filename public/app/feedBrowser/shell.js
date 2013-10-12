define(['durandal/app', 'durandal/plugins/router', 'authChecker'], function(app, router, authChecker) {

	return {
		router : router,
		activate : function() {
			return app.start().then(function() {
				router.map([{
					url : 'orgs',
					moduleId : 'feedBrowser/viewOrgs/list',
					name : 'My Organizations',
					visible : true
				}, {
					url : 'orgs/:id',
					moduleId : 'feedBrowser/viewOrg/view',
					name : 'View Organization',
					visible : true
				}, {
					url : 'feeds/:feedId',
					moduleId : 'feedBrowser/viewFeed/feed',
					name : 'View Feeds'
				}, {
					url : 'feeds/:feedId/collections/:collectionId',
					moduleId : 'feedBrowser/viewCollection/view',
					name : 'View Collections'
				}, {
					url : 'feeds/:feedId/collections/:collectionId/data',
					moduleId : 'feedBrowser/viewData/view',
					name : 'Collection Data'
				}, {
					url : 'feeds/:feedId/collections/:collectionId/fields/:fieldId',
					moduleId : 'feedBrowser/modifyField/modify',
					name : 'Modify Field'
				}, {
					url : 'login',
					moduleId : 'feedBrowser/login/login',
					name : 'Login',
					visible : true
				}]);

				return router.activate('orgs');				
			});
		}
	};
});
