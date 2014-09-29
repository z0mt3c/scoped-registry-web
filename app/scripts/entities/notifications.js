var App = require('application');

module.exports = App.module('Entities', function (Entities, App, Backbone) {
    Entities.Notification = Backbone.Model.extend({
        defaults: {
            timeout: 5000,
            type: 'info'
        }
    });
    Entities.NotificationCollection = Backbone.Collection.extend({
        model: Entities.Notification
    });

    var notifications = new Entities.NotificationCollection([]);

    var API = {
        getNotifications: function () {
            return notifications;
        }
    };

    App.reqres.setHandler('notification:entities', function () {
        return API.getNotifications();
    });
});