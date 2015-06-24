/// <reference path="../../../../../references.d.ts" />

import plat = require('platypus');
import BaseViewControl = require('../../../base.viewcontrol');
import UserRepository = require('../../../../repositories/user.repository');

class ResetPasswordViewControl extends BaseViewControl {
	title = 'Reset Password';
	
	templateString = require('./reset.viewcontrol.html');
	
	context = {
		password: '',
		token: '',
	};
	
	constructor(private userRepository: UserRepository) {
		super();
	}
	
	navigatedTo(parameters: { token: string }) {
		var context = this.context;
		var token = context.token = parameters.token;
		
		if (this.utils.isString(token)) {
			this.userRepository.checkTokenExpiration(token).then(null, (errors) => {
				this._globalAlert.setAlerts(errors, 'fail');
			});
		}
	}
	
	submit() {
		var context = this.context;
		
		this.userRepository.resetPassword(context.token, context.password).then((result) => {
			this._globalAlert.setAlerts('Your password has been reset.', 'success');
		}, (errors) => {
			this._globalAlert.setAlerts(errors, 'fail');
		})
	}
}

plat.register.viewControl('resetpassword-vc', ResetPasswordViewControl, [
	UserRepository
]);

export = ResetPasswordViewControl;
