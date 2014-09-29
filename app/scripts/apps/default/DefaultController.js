var App = require('application');
var View = require('./DefaultView');
var $ = require('jquery');

require('../../entities/default');

module.exports =  {
    showStatus: function () {
        var fetchEntity = App.request('default:status');
        $.when(fetchEntity).done(function (entity) {
            var view = new View.Status({
                model: entity
            });
            App.mainRegion.show(view);
        });
    }
};
