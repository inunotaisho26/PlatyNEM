/// <reference path="../../../../../references.d.ts" />

import plat = require('platypus');
import BaseViewControl = require('../../../base.viewcontrol');
import LoginViewControl = require('../login/login.viewcontrol');
import repositories = require('../../../../repositories/user.repository');

class RegisterViewControl extends BaseViewControl {
	title = 'Register';
	templateString = require('./register.viewcontrol.html');
	context = {
		firstname: '',
		lastname: '',
		email: '',
		password: '',
		login: LoginViewControl
	};

	constructor(private userRepository: repositories.UserRepository) {
	    super();
	}

	register() {
		var context = this.context;
		this.userRepository.create({
			firstname: context.firstname,
			lastname: context.lastname,
			email: context.email
		}, context.password);
	}
}

plat.register.viewControl('register-vc', RegisterViewControl, [
	repositories.UserRepository
]);

export = RegisterViewControl;
