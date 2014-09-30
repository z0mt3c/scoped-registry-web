var App = require('application');
var View = require('./PackagesView');
var $ = require('jquery');
var Backbone = require('backbone');
require('../../entities/packages');
require('../../templates/helpers/eachProperty.js');
var fetchPackageList = App.request('packages:entities');
var FilteredCollection = require('backbone-filtered-collection');

module.exports = {
    showDetail: function (request) {
		var id = request.id;
		var version = request.version;

        var fetchEntity = App.request('packages:entity', id);
        var fetchReadme = App.request('packages:readme', id, version);

        $.when(fetchEntity).done(function (entity) {
            var detailView = new View.Item({ version: version, model: entity });

			detailView.on('switch:version', function(version) {
				App.trigger('packages:detail', id, version);
			});
			detailView.on('back', function() {
				window.history.back();
			});

			detailView.render();
            App.mainRegion.show(detailView);

			$.when(fetchReadme).done(function(readme) {
				detailView.readmeRegion.show(new View.Readme({ model: readme }));
			});
        });
    },
    showStart: function () {
		$.when(fetchPackageList).done(function (entities) {
			var view = new View.Collection({
				collection: entities
			});

			view.on('child:clicked', function (view) {
				App.trigger('packages:detail', view.model.id);
			});

			App.mainRegion.show(view);
		});
    },
    showResults: function (query) {
		$.when(fetchPackageList).done(function (entities) {
			var filtered = new FilteredCollection(entities);

			filtered.filterBy('query', function(model) {
				return model.get('description').indexOf(query) !== -1 || model.get('name').indexOf(query) !== -1;
			});

			var view = new View.Results({
				collection: filtered,
				model: new Backbone.Model({query: query})
			});

			view.on('child:clicked', function (view) {
				App.trigger('packages:detail', view.model.id);
			});

			App.mainRegion.show(view);
		});
    }
};
