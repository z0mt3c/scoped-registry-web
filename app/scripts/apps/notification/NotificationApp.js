var App = require('application');
var Controller = require('./NotificationController');

module.exports = App.module('NotificationApp', function (NotificationApp) {
    var API = {
        showNotifications: function () {
            Controller.showNotifications();
        },
        addNotification: function (data) {
            Controller.addNotification(data);
        }
    };

    NotificationApp.on('start', function () {
        API.showNotifications();

        App.on('notification:add', function (data) {
            API.addNotification(data);
        });
    });
});


