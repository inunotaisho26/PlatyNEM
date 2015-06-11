/// <reference path="../references.d.ts" />

require('platypus');
require('platypusui');

// app
require('./app/app');

// injectables
require('./common/injectables/moment.injectable');

// templatecontrols
require('./common/templatecontrols/globalalert/globalalert.templatecontrol');
require('./common/templatecontrols/localalert/localalert.templatecontrol');
require('./common/templatecontrols/htmlify/htmlify.templatecontrol');
require('./common/templatecontrols/navigation/admin/admin.templatecontrol');
require('./common/templatecontrols/navigation/public/public.templatecontrol');
require('./common/templatecontrols/sidebar/sidebar.templatecontrol');
