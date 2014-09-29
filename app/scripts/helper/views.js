var App = require('application');

module.exports = App.module('Common.Views', function (Views, App, Backbone) {
    Views.Loading = Backbone.Marionette.ItemView.extend({
        template: require('./templates/loading.hbs'),

        initialize: function (options) {
            options = options || {};
            this.title = options.title || 'Loading Data';
            this.message = options.message || 'Please wait, data is loading.';
        },

        serializeData: function () {
            return {
                title: this.title,
                message: this.message
            };
        }
    });
});