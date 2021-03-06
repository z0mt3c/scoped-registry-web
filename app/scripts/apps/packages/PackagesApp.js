var App = require('application');
var log = require('loglevel');
var Controller = require('./PackagesController');

module.exports = App.module('PackagesApp', function (PackagesApp) {
    PackagesApp.startWithParent = false;

    PackagesApp.onStart = function () {
        log.debug('starting PackagesApp');
    };

    PackagesApp.onStop = function () {
        log.debug('stopping PackagesApp');
    };
});

App.module('Routers.PackagesApp', function (PackagesAppRouter, App, Backbone) {
    var executeAction = function (action, arg) {
        App.startSubApp('PackagesApp');
        action(arg);
    };

    PackagesAppRouter.Router = Backbone.Marionette.AppRouter.extend({
        appRoutes: {
            'packages': 'showStart',
            'packages/:id': 'showDetail',
            'packages/:id/:version': 'showDetail',
            'search/:query': 'showResults'
        }
    });

    var API = {
        showStart: function () {
            executeAction(Controller.showStart);
            App.execute('set:active:header', '/packages');
        },
        showDetail: function (id, version) {
            executeAction(Controller.showDetail, { id: id, version: version });
            App.execute('set:active:header', '/packages');
        },
        showResults: function (query) {
			console.log(arguments);
            executeAction(Controller.showResults, query);
            App.execute('set:active:header', '/packages');
        }
    };

    App.on('packages:start', function () {
        App.navigate('/packages');
        API.showStart();
    });

    App.on('packages:detail', function (id, version) {
        App.navigate('/packages/' + encodeURIComponent(id) + (version ? '/' + encodeURIComponent(version) : ''));
        API.showDetail(id);
    });

    App.on('packages:search', function (query) {
        App.navigate('/search/' + encodeURIComponent(query));
        API.showResults(query);
    });

    App.addInitializer(function () {
        new PackagesAppRouter.Router({
            controller: API
        });
    });
});
