/// <reference path="../../../../../references.d.ts" />

import plat = require('platypus');
import HomeViewControl = require('../../../../viewcontrols/public/home/home.viewcontrol');
import LoginViewControl = require('../../../../viewcontrols/public/auth/login/login.viewcontrol');

class AdminNavigation extends plat.ui.TemplateControl {
	templateString = require('./admin.templatecontrol.html');
	hasOwnContext = true;
	context = {
		logoView: HomeViewControl,
		menuItems: [
			{
				title: 'Log Out',
				view: LoginViewControl
			}
		]
	};
}

plat.register.control('admin-navigation', AdminNavigation);

export = AdminNavigation;
