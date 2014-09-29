var App = require('application');
var View = require('./PackagesView');
var $ = require('jquery');
require('../../entities/packages');
require('../../templates/helpers/eachProperty.js');

function getSideView(preselectedId) {
    var defer = $.Deferred();
    var fetchEntities = App.request('packages:entities');

    $.when(fetchEntities).done(function (entities) {
        function selectItem(id) {
            if (id) {
                //entities.get(id).select();
            } else {
                //entities.deselect();
            }
        }

        var view = new View.Collection({
            collection: entities
        });

        selectItem(preselectedId);

        view.listenTo(entities, 'select:one', function (model) {
            App.trigger('packages:detail', model.get('id'));
        });

        view.listenTo(App, 'packages:side:select', selectItem);

        defer.resolve(view);
    });

    return defer.promise();
}

function getLayout(id) {
    var defer = $.Deferred();

    if (App.mainRegion.currentView && App.mainRegion.currentView instanceof View.Layout) {
        defer.resolve(App.mainRegion.currentView);
    } else {
        var layout = new View.Layout();
        var loadSide = getSideView(id);

        $.when(loadSide).done(function (sideView) {
            App.mainRegion.show(layout);
            layout.sideRegion.show(sideView);
            defer.resolve(layout);
        });
    }

    return defer.promise();
}

module.exports = {
    showDetail: function (request) {
		var id = request.id;
		var version = request.version;

        var loadLayout = getLayout(id);
        var fetchEntity = App.request('packages:entity', id);
        var fetchReadme = App.request('packages:readme', id, version);

        $.when(loadLayout, fetchEntity).done(function (layout, entity) {
            var detailView = new View.Item({
				version: version,
                model: entity
            });

			detailView.on('switch:version', function(version) {
				App.trigger('packages:detail', id, version);
			});

			detailView.render();
            layout.mainRegion.show(detailView);

			$.when(fetchReadme).done(function(readme) {
				detailView.readmeRegion.show(new View.Readme({ model: readme }));
			});
        });
    },
    showStart: function () {
        var loadLayout = getLayout();

        $.when(loadLayout).done(function (layout) {
            layout.mainRegion.show(new View.Empty({}));
        });
    }
};
