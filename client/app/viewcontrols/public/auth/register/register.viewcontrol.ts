/// <reference path="../../../../../references.d.ts" />

import plat = require('platypus');
import BaseViewControl = require('../../../base.viewcontrol');
import LoginViewControl = require('../login/login.viewcontrol');
import UserRepository = require('../../../../repositories/user.repository');

class RegisterViewControl extends BaseViewControl {
	title = 'Register';
	templateString = require('./register.viewcontrol.html');
	context = {
		firstname: '',
		lastname: '',
		email: '',
		password: '',
		login: LoginViewControl,
		alerts: <server.ajax.IValidationErrors>[]
	};

	constructor(private userRepository: UserRepository) {
	    super();
	}

	register() {
		var context = this.context;
		
		this.userRepository.create({
			firstname: context.firstname,
			lastname: context.lastname,
			email: context.email
		}, context.password).then(() => {
			context.alerts.push({ message: 'Account created successfully.' });
		}, (errors) => {
			context.alerts = errors;
		});
	}
}

plat.register.viewControl('register-vc', RegisterViewControl, [
	UserRepository
]);

export = RegisterViewControl;
