/// <reference path="../../../../../references.d.ts" />

import plat = require('platypus');
import HomeViewControl = require('../../../../viewcontrols/public/home/home.viewcontrol');
import LogoutViewControl = require('../../../../viewcontrols/public/auth/logout/logout.viewcontrol');

class AdminNavigation extends plat.ui.TemplateControl {
	templateString = require('./admin.templatecontrol.html');
	hasOwnContext = true;
	context = {
		logoView: HomeViewControl,
		menuItems: [
			{
				title: 'Log Out',
				view: LogoutViewControl
			}
		]
	};
}

plat.register.control('admin-navigation', AdminNavigation);

export = AdminNavigation;
