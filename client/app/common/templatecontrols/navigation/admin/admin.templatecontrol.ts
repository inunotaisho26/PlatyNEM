/// <reference path="../../../../../typings/tsd.d.ts" />

import plat = require('platypus');

class AdminNavigation extends plat.ui.TemplateControl {
	templateString = require('./admin.templatecontrol.html');
	context = {};
}

plat.register.control('admin-navigation', AdminNavigation);

export = AdminNavigation;
