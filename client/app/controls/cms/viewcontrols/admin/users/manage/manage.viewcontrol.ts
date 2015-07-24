import {controls, async, register} from 'platypus';
import UserRepository from '../../../../../../repositories/user.repository';
import AdminBaseViewControl from '../../../base.viewcontrol';

export default class ViewControl extends AdminBaseViewControl {
    title = 'Edit User';
    templateString = require('./manage.viewcontrol.html');
    saveButton: controls.INamedElement<HTMLButtonElement, any>;
    context = {
        user: <models.IUser>{},
        password: <string>null,
        newpassword: <string>null,
        confirmpassword: <string>null,
        roles: ['admin', 'contributor', 'visitor'],
        editMode: false,
        avatarPrompt: 'Select a new avatar'
    };

    constructor(private userRepository: UserRepository) {
        super();
    }

    navigatedTo(parameters: { id: string }) {
        var context = this.context;

        if (!isNaN(Number(parameters.id))) {
            context.editMode = true;
            this.userRepository.one(parameters.id).then((user: models.IUser) => {
                context.user = user;
            });
        }
    }

    updateUser(user: models.IUser) {
        var context = this.context;
        var promise: async.IThenable<any>;

        if (context.editMode) {
            promise = this.userRepository.update(user);
        } else {
            promise = this.userRepository.create(user, context.password);
        }

        promise.then(() => {
            this._globalAlert.setAlerts('User has been saved', 'success');
        }, (errors) => {
            this._globalAlert.setAlerts(errors, 'fail');
        });
    }

    avatarSelected(ev) {
        this.context.avatarPrompt = ev.target.files[0].name;
        this.enableSave();
    }

    enableSave() {
        this.saveButton.element.removeAttribute('disabled');
    }
}

register.viewControl('manageuser-vc', ViewControl, [
    UserRepository
]);
