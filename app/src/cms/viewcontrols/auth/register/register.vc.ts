import {register} from 'platypus';
import BaseViewControl from '../../base.vc';
import UserRepository from '../../../../repositories/user.repo';

export default class RegisterViewControl extends BaseViewControl {
    title: string = 'Register';
    templateString: string = require('./register.vc.html');
    context: {
        user: { firstname: string; lastname: string; email: string; };
        password: string;
        avatarPrompt: string;
    } = {
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

    avatarSelected(ev: any): void {
        this.context.avatarPrompt = ev.target.files[0].name;
    }

    register(user: string, password: string): void {
        var context = this.context;

        this.userRepository.create(context.user, context.password).then((response) => {
            this.globalAlert.setAlerts('Account has been created', 'success');
        }, (errors: server.errors.IValidationErrors | server.errors.IValidationError) => {
            console.log(errors);
            this.globalAlert.setAlerts(errors, 'fail');
        });
    }
}

register.viewControl('register-vc', RegisterViewControl, [
    UserRepository
]);
