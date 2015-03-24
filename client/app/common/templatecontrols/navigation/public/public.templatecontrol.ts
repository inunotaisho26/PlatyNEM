/// <reference path="../../../../../typings/tsd.d.ts" />

import plat = require('platypus');

class PublicNavigation extends plat.ui.TemplateControl {
	templateString = require('./public.templatecontrol.html');
	context = {};
}

plat.register.control('public-navigation', PublicNavigation);

export = PublicNavigation;
