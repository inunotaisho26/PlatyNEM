import {controls, async, register} from 'platypus';
import UserRepository from '../../../../../repositories/user.repo';
import AdminBaseViewControl from '../../../base.vc';

export default class ViewControl extends AdminBaseViewControl {
    title: string = 'Edit User';
    templateString: string = require('./manage.vc.html');
    saveButton: controls.INamedElement<HTMLButtonElement, any>;
    context: {
        user: models.IUser;
        password: string;
        newpassword: string;
        confirmpassword: string;
        roles: Array<string>;
        editMode: boolean;
        avatarPrompt: string;
    } = {
        user: <models.IUser>{},
        password: null,
        newpassword: null,
        confirmpassword: null,
        roles: ['admin', 'contributor', 'visitor'],
        editMode: false,
        avatarPrompt: 'Select a new avatar'
    };

    constructor(private userRepository: UserRepository) {
        super();
    }

    navigatedTo(parameters: { id: string }): void {
        var context = this.context;

        if (!isNaN(Number(parameters.id))) {
            context.editMode = true;
            this.userRepository.read(parameters.id).then((user: models.IUser) => {
                context.user = user;
            });
        }
    }

    updateUser(user: models.IUser): void {
        var context = this.context;
        var promise: async.IThenable<any>;

        if (context.editMode) {
            promise = this.userRepository.update(user);
        } else {
            promise = this.userRepository.create(user, context.password);
        }

        promise.then(() => {
            this.globalAlert.setAlerts('User has been saved', 'success');
        }, (errors) => {
            this.globalAlert.setAlerts(errors, 'fail');
        });
    }

    avatarSelected(ev): void {
        this.context.avatarPrompt = ev.target.files[0].name;
        this.enableSave();
    }

    enableSave(): void {
        this.saveButton.element.removeAttribute('disabled');
    }
}

register.viewControl('manageuser-vc', ViewControl, [
    UserRepository
]);
