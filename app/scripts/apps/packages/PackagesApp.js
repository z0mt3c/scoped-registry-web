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
            'packages/:id/:version': 'showDetail'
        }
    });

    var API = {
        showStart: function () {
            executeAction(Controller.showStart);
            App.trigger('packages:side:select');
            App.execute('set:active:header', '/packages');
        },
        showDetail: function (id, version) {
            executeAction(Controller.showDetail, { id: id, version: version });
            App.trigger('packages:side:select', id);
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

    App.addInitializer(function () {
        new PackagesAppRouter.Router({
            controller: API
        });
    });
});
