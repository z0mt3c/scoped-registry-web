var Marionette = require('backbone.marionette');
var views = module.exports = { };
require('bootstrap.dropdown');

views.Layout = Marionette.LayoutView.extend({
    template: require('./templates/layout.hbs'),
    regions: {
        sideRegion: '#md-side',
        mainRegion: '#md-main'
    }
});

views.Empty = Marionette.ItemView.extend({
    template: require('./templates/empty.hbs')
});

views.Readme = Marionette.ItemView.extend({
    template: require('./templates/readme.hbs')
});

views.Item = Marionette.LayoutView.extend({
    template: require('./templates/detail.hbs'),
	serializeData: function() {
		var data = this.model.toJSON();
		data.version = data.versions[this.options.version || data['dist-tags'].latest];
        return data;
	},
	regions: {
		readmeRegion: '.readme-region'
	}
});

views.CollectionItem = Marionette.ItemView.extend({
    template: require('./templates/listItem.hbs'),
    tagName: 'a',
    className: 'list-group-item',
    attributes: {
        href: '#'
    },
    events: {
        'click': 'navigate'
    },
    modelEvents: {
        'selected': 'onRender',
        'deselected': 'onRender'
    },
    navigate: function (e) {
        e.preventDefault();
        this.model.select();
    },
    onRender: function () {
        this.$el.attr('href', '/packages/' + encodeURIComponent(this.model.id));

        if (this.model.selected) {
            this.$el.addClass('active');
        } else {
            this.$el.removeClass('active');
        }
    }
});

views.Collection = Marionette.CompositeView.extend({
    template: require('./templates/list.hbs'),
    childView: views.CollectionItem,
    childViewContainer: 'div.list-group'
});
