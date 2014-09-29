var Marionette = require('backbone.marionette');
var views = module.exports = { };

views.Status = Marionette.ItemView.extend({
    template: require('./templates/status.hbs')
});
