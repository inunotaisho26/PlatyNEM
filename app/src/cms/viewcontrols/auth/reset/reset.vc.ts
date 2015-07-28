import {register} from 'platypus';
import BaseViewControl from '../../base.vc';
import UserRepository from '../../../../repositories/user.repo';

export default class ResetPasswordViewControl extends BaseViewControl {
	title: string = 'Reset Password';
	templateString: string = require('./reset.vc.html');
	context: {
        password: string;
        token: string;
        errors: Array<string>;
        success: string;
    } = {
		password: '',
		token: '',
		errors: null,
		success: ''
	};

	constructor(private userRepository: UserRepository) {
		super();
	}

	navigatedTo(parameters: { token: string }): void {
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

	submit(): void {
		var context = this.context;

		this.userRepository.resetPassword(context.token, context.password).then((result) => {
			this.context.success = result;
		}, (errors) => {
			this.context.errors = errors;
		});
	}
}

register.viewControl('resetpassword-vc', ResetPasswordViewControl, [
	UserRepository
]);
