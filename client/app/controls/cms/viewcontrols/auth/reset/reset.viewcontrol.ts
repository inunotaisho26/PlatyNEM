import {register} from 'platypus';
import BaseViewControl from '../../base.viewcontrol';
import UserRepository from '../../../../../repositories/user.repository';

export default class ResetPasswordViewControl extends BaseViewControl {
	title = 'Reset Password';

	templateString = require('./reset.viewcontrol.html');

	context = {
		password: '',
		token: '',
		errors: <Array<string>>null,
		success: ''
	};

	constructor(private userRepository: UserRepository) {
		super();
	}

	navigatedTo(parameters: { token: string }) {
		var context = this.context;
		var token = context.token = parameters.token;

		if (this.utils.isString(token)) {
			this.userRepository.checkTokenExpiration(token).then((result) => {
				return;
			}, (errors) => {
				this.context.errors = errors;
			});
		}
	}

	submit() {
		var context = this.context;

		this.userRepository.resetPassword(context.token, context.password).then((result) => {
			this.context.success = result;
		}, (errors) => {
			this.context.errors = errors;
		})
	}
}

register.viewControl('resetpassword-vc', ResetPasswordViewControl, [
	UserRepository
]);
