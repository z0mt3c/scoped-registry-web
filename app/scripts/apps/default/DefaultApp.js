var log = require('loglevel');
var App = require('application');

App.module('DefaultApp', function (DefaultApp) {
    DefaultApp.startWithParent = false;

    DefaultApp.onStart = function () {
        log.debug('starting DefaultApp');
    };

    DefaultApp.onStop = function () {
        log.debug('stopping DefaultApp');
    };
});

App.module('Routers.DefaultApp', function (DefaultAppRouter, App, Backbone) {
    var executeAction = function (action, arg) {
        App.startSubApp('DefaultApp');
        action(arg);
    };

    DefaultAppRouter.Router = Backbone.Marionette.AppRouter.extend({
        appRoutes: {
            'status': 'showStatus'
        }
    });

    var API = {
        showStatus: function (criterion) {
            var DefaultController = require('./DefaultController');
            App.execute('set:active:header', '/status');
            executeAction(DefaultController.showStatus, criterion);
        }
    };

    App.on('default:status', function () {
        App.navigate('status');
        API.showStatus();
    });

    App.addInitializer(function () {
        new DefaultAppRouter.Router({
            controller: API
        });
    });
});

module.exports = App.DefaultApp;
