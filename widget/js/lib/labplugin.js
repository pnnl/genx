var plugin = require('./index');
var base = require('@jupyter-widgets/base');

module.exports = {
  id: 'genx-widget',
  requires: [base.IJupyterWidgetRegistry],
  activate: function(app, widgets) {
      widgets.registerWidget({
          name: 'genx-widget',
          version: plugin.version,
          exports: plugin
      });
  },
  autoStart: true
};

