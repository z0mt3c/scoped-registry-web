var Marionette = require('backbone.marionette');

require('bootstrap.modal');

module.exports = Marionette.Region.extend({
    el: '#dialog',

    onShow: function (view) {
        var self = this,
            modal = this.$el.modal('show');

        this.listenTo(view, 'dialog:destroy', this.destroyDialog);

        modal.one('hidden.bs.modal', function () {
            self.stopListening();
            self.reset();
        });
    },

    destroyDialog: function () {
        this.$el.modal('hide');
    }
});