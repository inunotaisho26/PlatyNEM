import {register} from 'platypus';
import BaseViewControl from '../../base.vc';
import UserRepository from '../../../../repositories/user.repo';

export default class RegisterViewControl extends BaseViewControl {
    title = 'Register';

    templateString = require('./register.vc.html');

    context = {
        user: {
            firstname: '',
            lastname: '',
            email: ''
        },
        password: '',
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
            this._globalAlert.setAlerts('Account has been created', 'success');
        }, (errors: server.errors.IValidationErrors | server.errors.IValidationError) => {
            console.log(errors);
            this._globalAlert.setAlerts(errors, 'fail');
        });
    }
}

register.viewControl('register-vc', RegisterViewControl, [
    UserRepository
]);
