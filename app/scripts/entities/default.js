var App = require('application');
var $ = require('jquery');

module.exports = App.module('Entities', function (Entities, App, Backbone) {
    Entities.Status = Backbone.Model.extend({
        url: '/-/status'
    });

    var API = {
        getStatus: function () {
            var entity = new Entities.Status({});
            var defer = $.Deferred();

            entity.fetch({
                success: function (data) {
                    defer.resolve(data);
                }
            });

            return defer.promise();
        }
    };

    App.reqres.setHandler('default:status', function () {
        return API.getStatus();
    });
});
