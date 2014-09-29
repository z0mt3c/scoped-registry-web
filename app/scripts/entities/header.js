var App = require('application');
var Picky = require('backbone.picky');
var _ = require('lodash');

module.exports = App.module('Entities', function (Entities, App, Backbone) {
    Entities.Header = Backbone.Model.extend({
        initialize: function () {
            var selectable = new Picky.Selectable(this);
            _.assign(this, selectable);
            this.select = selectable.select;
            this.deselect = selectable.deselect;
        }
    });

    Entities.HeaderCollection = Backbone.Collection.extend({
        model: Entities.Header,

        initialize: function () {
            var singleSelect = new Picky.SingleSelect(this);
            _.assign(this, singleSelect);
            this.select = singleSelect.select;
            this.deselect = singleSelect.deselect;
        }
    });

    var initializeHeaders = function () {
        Entities.headers = new Entities.HeaderCollection([
            { name: 'Packages', url: '/packages', navigationTrigger: 'packages:start' },
            { name: 'Status', url: '/status', navigationTrigger: 'default:status' }
        ]);
    };

    var API = {
        getHeaders: function () {
            if (Entities.headers === undefined) {
                initializeHeaders();
            }
            return Entities.headers;
        }
    };

    App.reqres.setHandler('header:entities', function () {
        return API.getHeaders();
    });
});
