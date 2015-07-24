import {register, routing} from 'platypus';
import LoginViewControl from '../login/login.vc';
import RegisterViewControl from '../register/register.vc';
import ForgotPasswordViewControl from '../forgot/forgot.vc';
import ResetPasswordViewControl from '../reset/reset.vc';
import BaseViewControl from '../../base.vc';

export default class AuthViewControl extends BaseViewControl {
    templateString = require('./main.vc.html');
    context = {};
    constructor(router: routing.Router) {
        super();

        router.configure([
            { pattern: 'login', view: LoginViewControl },
            { pattern: 'register', view: RegisterViewControl },
            { pattern: 'forgot-password', view: ForgotPasswordViewControl },
            { pattern: 'reset-password/:token', view: ResetPasswordViewControl }
        ]);
    }
}

register.viewControl('auth-vc', AuthViewControl, [
    routing.Router
]);
