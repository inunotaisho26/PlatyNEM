/// <reference path="../../../../../references.d.ts" />

import plat = require('platypus');
import BaseViewControl = require('../../../base.viewcontrol');
import RegisterViewControl = require('../register/register.viewcontrol');

class LoginViewControl extends BaseViewControl {
	title = 'Login';
	templateString = require('./login.viewcontrol.html');
	context = {
		email: '',
		password: '',
		register: RegisterViewControl
	};

	login() {
		var context = this.context;
		console.log(context.email, context.password);
	}
}

plat.register.viewControl('login-vc', LoginViewControl);

export = LoginViewControl;
