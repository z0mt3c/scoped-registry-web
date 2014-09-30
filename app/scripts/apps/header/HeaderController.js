var App = require('application');
var _ = require('lodash');
var View = require('./HeaderView');
require('../../entities/header');

module.exports = {
    listHeader: function () {
        var links = App.request('header:entities');
        var headers = new View.Headers({collection: links});

        headers.on('brand:clicked', function () {
            App.trigger('default:start');
        });

        headers.on('childview:navigate', function (childView, model) {
            var trigger = model.get('navigationTrigger');

            if (!_.isArray(trigger)) {
                trigger = [trigger];
            }

            App.trigger.apply(App, trigger);
        });

		headers.on('search', function(query) {
			App.trigger('packages:search', query);
		});

        App.headerRegion.show(headers);
    },

    setActiveHeader: function (headerUrl) {
        var links = App.request('header:entities');
        var headerToSelect = links.find(function (header) {
            return header.get('url') === headerUrl;
        });

        headerToSelect.select();
        links.trigger('reset');
    }
};
