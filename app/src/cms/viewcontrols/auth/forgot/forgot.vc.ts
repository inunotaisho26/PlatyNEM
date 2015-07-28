import {register} from 'platypus';
import CMSBaseViewControl from '../../base.vc';
import LoginViewControl from '../login/login.vc';
import UserRepository from '../../../../repositories/user.repo';

export default class ForgotPasswordViewControl extends CMSBaseViewControl {
	title: string = 'Forgot Password';
	templateString: string = require('./forgot.vc.html');
	context: {
        email: string;
        loginView: typeof LoginViewControl;
    } = {
		email: '',
		loginView: LoginViewControl
	};

	constructor(private userRepository: UserRepository) {
		super();
	}

	submit(): void {
		this.userRepository.createResetToken(this.context.email).then((result) => {
			console.log(result);
		});
	}
}

register.viewControl('forgotpassword-vc', ForgotPasswordViewControl, [
	UserRepository
]);
