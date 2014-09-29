var Marionette = require('backbone.marionette');
var views = module.exports = { };

views.Notification = Marionette.ItemView.extend({
    template: require('./templates/listItem.hbs'),
    tagName: 'li',
    className: 'notification-item list-group-item animated fadeInRightBig fast',
    events: {
    },
    onRender: function () {
        var self = this;
        this.$el.addClass('list-group-item-' + this.model.get('type'));
        var timeout = this.model.get('timeout');

        setTimeout(function () {
            self.$el.slideUp('fast', function () {
                self.model.destroy();
            });
        }, timeout);

        this.$el.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            self.$el.removeClass('animated bounceInRight');
        });
    }
});

views.Notifications = Marionette.CompositeView.extend({
    template: require('./templates/list.hbs'),
    className: 'notifications list-group',
    childView: views.Notification,
    childViewContainer: 'ul',
    events: {
    }
});