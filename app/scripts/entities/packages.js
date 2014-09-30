var App = require('application');
var _ = require('lodash');
var $ = require('jquery');

module.exports = App.module('Entities', function (Entities, App, Backbone) {
    Entities.Packages = Backbone.Model.extend({
        urlRoot: '/',
		parse: function(resp) {
			resp.id = resp.name;
			resp.encodedId = encodeURIComponent(resp.name);
			return resp;
		}
    });

    Entities.Readme = Backbone.Model.extend({
        url: function() {
			return '/' + encodeURIComponent(this.id) + '/' + (this.get('version') ? this.get('version') + '/'  : '') + 'readme';
		},
		fetch: function(options) {
			return Backbone.Model.prototype.fetch.call(this, _.extend({ dataType: 'html'}, options));
		},
		parse: function(resp) {
			return { readme: resp };
		}
    });

    Entities.PackagesCollection = Backbone.Collection.extend({
        model: Entities.Packages,
        url: '/-/all'
    });

    var API = {
        getEntities: function () {
            var entities = new Entities.PackagesCollection();
            var defer = $.Deferred();

            entities.fetch({
                success: function (data) {
                    defer.resolve(data);
                }
            });

            return defer.promise();
        },
        getEntity: function (id) {
            var entity = new Entities.Packages({id: id});
            var defer = $.Deferred();

            entity.fetch({
                success: function (data) {
                    defer.resolve(data);
                }
            });

            return defer.promise();
        },
        getReadme: function (id, version) {
            var entity = new Entities.Readme({id: id, version: version});
            var defer = $.Deferred();

            entity.fetch({
                success: function (data) {
                    defer.resolve(data);
                },
				error: function() {
					console.log(arguments);
					defer.reject();
				}
            });

            return defer.promise();
        }
    };

    App.reqres.setHandler('packages:entities', function () {
        return API.getEntities();
    });

    App.reqres.setHandler('packages:entity', function (id) {
        return API.getEntity(id);
    });

    App.reqres.setHandler('packages:readme', function (id, version) {
        return API.getReadme(id, version);
    });
});
