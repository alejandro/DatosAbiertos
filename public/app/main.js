'use strict';

requirejs.config({
    paths: {
        'text': 'durandal/amd/text',
        'foreachprop': 'bindingHandlers/ko.foreachprop',
        'underscore' : '../scripts/underscore'
    },
    shim: {
        underscore: {
            exports: '_'
        }
    }
});

define(['durandal/app', 'durandal/system', 'durandal/viewLocator'],
  function (app, system, viewLocator) {
    
    system.debug(true);
    
    app.title = 'Datos Abiertos';
    app.start().then(function () {
        viewLocator.useConvention();
		app.adaptToDevice();
        app.setRoot('feedBrowser/shell', 'entrance');
    });
});