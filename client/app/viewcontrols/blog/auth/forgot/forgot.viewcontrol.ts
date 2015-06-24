/// <reference path="../../../../../references.d.ts" />

import plat = require('platypus');
import BaseViewControl = require('../../../base.viewcontrol');
import LoginViewControl = require('../login/login.viewcontrol');
import UserRepository = require('../../../../repositories/user.repository');

class ForgotPasswordViewControl extends BaseViewControl {
	title = 'Forgot Password';
	templateString = require('./forgot.viewcontrol.html');
	context = {
		email: '',
		loginView: LoginViewControl
	};
	
	constructor(private userRepository: UserRepository) {
		super();
	}
	
	submit() {
		this.userRepository.createResetToken(this.context.email).then(() => {
			this._globalAlert.setAlerts('A password recovery email has been sent.', 'success');
		}, (errors) => {
			console.log(errors);
			this._globalAlert.setAlerts(errors, 'fail');
		});
	}
}

plat.register.viewControl('forgotpassword-vc', ForgotPasswordViewControl, [
	UserRepository
]);

export = ForgotPasswordViewControl;
