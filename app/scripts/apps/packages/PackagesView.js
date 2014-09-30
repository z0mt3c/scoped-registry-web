var Marionette = require('backbone.marionette');
var views = module.exports = { };
require('bootstrap.dropdown');

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
	},
	triggers: {
		'click button[data-hook="go-back"]': 'back'
	}
});

views.CollectionItem = Marionette.ItemView.extend({
    template: require('./templates/listItem.hbs'),
    tagName: 'a',
    className: 'list-group-item',
    attributes: {
        href: '#'
    },
    triggers: {
        'click': 'clicked'
    },
    modelEvents: {
        'selected': 'onRender',
        'deselected': 'onRender'
    },
    onRender: function () {
        this.$el.attr('href', '/packages/' + encodeURIComponent(this.model.id));
    }
});

views.Collection = Marionette.CompositeView.extend({
    template: require('./templates/list.hbs'),
    childView: views.CollectionItem,
    childViewContainer: 'div.list-group',
	childViewEventPrefix: 'child',
	emptyView: views.Empty
});

views.Results = views.Collection.extend({ template: require('./templates/results.hbs') });
