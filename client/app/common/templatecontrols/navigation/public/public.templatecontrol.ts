/// <reference path="../../../../../references.d.ts" />

import plat = require('platypus');
import LoginViewControl = require('../../../../viewcontrols/public/auth/login/login.viewcontrol');
import RegisterViewControl = require('../../../../viewcontrols/public/auth/register/register.viewcontrol');
import HomeViewControl = require('../../../../viewcontrols/public/home/home.viewcontrol');

class PublicNavigation extends plat.ui.TemplateControl {
	templateString = require('./public.templatecontrol.html');
	hasOwnContext = true;
	context = {
		logoView: HomeViewControl,
		menuItems: [
			{
				title: 'Login',
				view: LoginViewControl
			},
			{
				title: 'Register',
				view: RegisterViewControl
			}
		]
	};
}

plat.register.control('public-navigation', PublicNavigation);

export = PublicNavigation;
