import {register, routing} from 'platypus';
import LoginViewControl from '../login/login.viewcontrol';
import RegisterViewControl from '../register/register.viewcontrol';
import ForgotPasswordViewControl from '../forgot/forgot.viewcontrol';
import ResetPasswordViewControl from '../reset/reset.viewcontrol';
import BaseViewControl from '../../base.viewcontrol';

export default class AuthViewControl extends BaseViewControl {
    templateString = require('./main.viewcontrol.html');
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
