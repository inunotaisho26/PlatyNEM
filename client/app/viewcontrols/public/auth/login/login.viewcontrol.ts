/// <reference path="../../../../../references.d.ts" />

import plat = require('platypus');
import BaseViewControl = require('../../../base.viewcontrol');
import RegisterViewControl = require('../register/register.viewcontrol');
import ForgotPasswordViewControl = require('../forgot/forgot.viewcontrol');
import UserRepository = require('../../../../repositories/user.repository');

class LoginViewControl extends BaseViewControl {
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
        ev.preventDefault();
        ev.stopPropagation();

        this.usersRepository.login(this.context.user).then((result) => {
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
        }, (errors) => {
            console.log(errors);
            this._globalAlert.setAlerts(errors, 'fail');
        });
    }
}

plat.register.viewControl('login-vc', LoginViewControl, [
    UserRepository
]);

export = LoginViewControl;
