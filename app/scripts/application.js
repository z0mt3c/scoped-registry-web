'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var Marionette = require('backbone.marionette');
var log = require('loglevel');
var dialogRegion = require('./helper/dialogRegion');
var mainTmpl = require('./templates/main.hbs');

// set log level - fallback: SILENT (5)
log.setLevel(1);

var App = new Marionette.Application();

/* Add application regions here */
App.addRegions({
    headerRegion: '#header-region',
    navigationRegion: '#navigation-region',
    notificationRegion: '#notification-region',
    mainRegion: '#main-region',
    dialogRegion: dialogRegion
});

App.navigate = function (route, options) {
    if (!options) {
        options = {};
    }

    Backbone.history.navigate(route, options);
};

App.getCurrentRoute = function () {
    return Backbone.history.fragment;
};

App.startSubApp = function (appName, args) {
    var currentApp = appName ? App.module(appName) : null;
    if (App.currentApp === currentApp) {
        return;
    }

    if (App.currentApp) {
        App.currentApp.stop();
    }

    App.currentApp = currentApp;
    if (currentApp) {
        currentApp.start(args);
    }
};

/* Add initializers here */
App.addInitializer(function () {
    document.body.innerHTML = mainTmpl({});
});

var initializeRouter = function () {
    if (!Backbone.history.start({ pushState: false })) {
		App.trigger('packages:start');
	}
};

App.on('start', function () {
    if (Backbone.history) {
        initializeRouter();

        if (App.getCurrentRoute() === '') {
            App.trigger('packages:start');
        }
    }

    $('.nav a').on('click', function () {
        if ($('.navbar-collapse').hasClass('in')) {
            $('.navbar-toggle').click();
        }
    });
});

module.exports = App;
