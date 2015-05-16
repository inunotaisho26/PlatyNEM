/// <reference path="../references.d.ts" />

// libs
require('platypus');
require('platypusui');
require('./lib/jquery/jquery.min.js');
require('./lib/colpick/js/colpick');

// app
require('./app/app');

// injectables
require('./common/injectables/jQuery.injectable');

// templatecontrols
require('./common/templatecontrols/alert/alert.templatecontrol');
require('./common/templatecontrols/navigation/admin/admin.templatecontrol');
require('./common/templatecontrols/navigation/public/public.templatecontrol');
require('./common/templatecontrols/toolbar/toolbar.templatecontrol');
