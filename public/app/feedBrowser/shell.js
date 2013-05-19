define(['durandal/plugins/router'], function (router) {
    
    return {
        router: router,
        activate: function () {
            router.map([
                { url: 'feeds', moduleId: 'feedBrowser/viewFeeds/feeds', name: 'Public Feeds', visible: true },
                { url: 'login', moduleId: 'feedBrowser/login/login', name: 'Login', visible: true },
                // { url: 'modal', moduleId: 'samples/modal/index', name: 'Modal Dialogs', visible: true },
                // { url: 'event-aggregator', moduleId: 'samples/eventAggregator/index', name: 'Events', visible: true },
                // { url: 'widgets', moduleId: 'samples/widgets/index', name: 'Widgets', visible: true },
                // { url: 'master-detail', moduleId: 'samples/masterDetail/index', name: 'Master Detail', visible: true },
                // { url: 'knockout-samples', moduleId: 'samples/knockout/index', name: 'Knockout Samples', visible: true },
                { url: 'feeds/:id', moduleId: 'feedBrowser/viewFeed/feed', name: 'View Public Feed' }
                
            ]);
            
            return router.activate('feeds');
        }
    };
});