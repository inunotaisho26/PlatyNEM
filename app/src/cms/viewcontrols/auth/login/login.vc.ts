import {register} from 'platypus';
import BaseViewControl from '../../base.vc';
import RegisterViewControl from '../register/register.vc';
import ForgotPasswordViewControl from '../forgot/forgot.vc';
import UserRepository from '../../../../repositories/user.repo';

export default class LoginViewControl extends BaseViewControl {
    title: string = 'Login';
    templateString: string = require('./login.vc.html');
    context: {
        user: { email: string; password: string; };
        registerView: typeof RegisterViewControl;
        forgotView: typeof ForgotPasswordViewControl;
    } = {
        user: {
            email: '',
            password: ''
        },
        registerView: RegisterViewControl,
        forgotView: ForgotPasswordViewControl
    };

    constructor(private usersRepository: UserRepository) {
        super();
    }

    login(ev: Event): void {
        var context = this.context;

        ev.preventDefault();
        ev.stopPropagation();

        this.usersRepository.login(context.user).then((result) => {
            return this.usersRepository.isAdmin();
        }).then((isAdmin) => {
            if (isAdmin) {
                this.navigator.navigate('admin-vc', {
                    replace: true
                });
            } else {
                this.navigator.navigate('public-vc', {
                    replace: true
                });
            }
        }, (error: server.errors.IValidationError) => {
            this.globalAlert.setAlerts(error, 'fail');
        });
    }
}

register.viewControl('login-vc', LoginViewControl, [
    UserRepository
]);

