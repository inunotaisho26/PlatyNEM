/// <reference path="../../../../../references.d.ts" />

import plat = require('platypus');
import BaseViewControl = require('../../../base.viewcontrol');
import UserRepository = require('../../../../repositories/user.repository');

class RegisterViewControl extends BaseViewControl {
    title = 'Register';
    
    templateString = require('./register.viewcontrol.html');
    
    context = {
        user: {
            firstname: '',
            lastname: '',
            email: ''
        },
        password: '',
        alerts: <server.ajax.IValidationErrors>[],
        avatarPrompt: 'Choose an Avatar'
    };

    constructor(private userRepository: UserRepository) {
        super();
    }

    avatarSelected(ev) {
        this.context.avatarPrompt = ev.target.files[0].name;
    }

    register(user, password) {
        var context = this.context;
        
        this.userRepository.create(context.user, context.password).then((response) => {
            context.alerts.push({ message: 'Account created successfully.' });
        }, (errors) => {
            context.alerts = errors;
        });
    }
}

plat.register.viewControl('register-vc', RegisterViewControl, [
    UserRepository
]);

export = RegisterViewControl;
