import {register} from 'platypus';
import CMSBaseViewControl from '../../base.viewcontrol';
import LoginViewControl from '../login/login.viewcontrol';
import UserRepository from '../../../../../repositories/user.repository';

export default class ForgotPasswordViewControl extends CMSBaseViewControl {
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
		this.userRepository.createResetToken(this.context.email).then((result) => {
			console.log(result);
		});
	}
}

register.viewControl('forgotpassword-vc', ForgotPasswordViewControl, [
	UserRepository
]);
