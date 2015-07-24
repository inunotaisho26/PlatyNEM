import {register} from 'platypus';
import BaseViewControl from '../../base.viewcontrol';
import RegisterViewControl from '../register/register.viewcontrol';
import ForgotPasswordViewControl from '../forgot/forgot.viewcontrol';
import UserRepository from '../../../../../repositories/user.repository';

export default class LoginViewControl extends BaseViewControl {
    title = 'Login';
    templateString = require('./login.viewcontrol.html');
    context = {
        user: {
            email: '',
            password: '',
        },
        registerView: RegisterViewControl,
        forgotView: ForgotPasswordViewControl
    };

    constructor(private usersRepository: UserRepository) {
        super();
    }

    login(ev: Event) {
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
            this._globalAlert.setAlerts(error, 'fail');
        });
    }
}

register.viewControl('login-vc', LoginViewControl, [
    UserRepository
]);

