var App = require('application');
var View = require('./NotificationView');
require('../../entities/notifications');

module.exports = {
    showNotifications: function () {
        var notifications = App.request('notification:entities');
        var notificationsView = new View.Notifications({
            collection: notifications
        });
        App.notificationRegion.show(notificationsView);
    },
    addNotification: function (data) {
        var notifications = App.request('notification:entities');
        notifications.add(data);
    }
};
