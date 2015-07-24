import {ui, register} from 'platypus';
import CMSBaseViewControl from '../../../base.vc';
import ManageUserViewControl from '../manage/manage.vc';
import UserRepository from '../../../../../repositories/user.repo';

export default class ListUsersViewControl extends CMSBaseViewControl {
    title = 'All Users';
    templateString = require('./list.vc.html');
    context = {
        users: <Array<models.IUser>>null,
        manageView: ManageUserViewControl,
        deleteModal: false
    };

    toDeleteId: string;

    constructor(private userRepository: UserRepository,
        private animator: ui.animations.Animator) {
        super();
    }

    initialize() {
        var context = this.context;

        this.refreshUsers();
    }

    toggleDeleteModal(id?: string) {
        var context = this.context;

        context.deleteModal = !context.deleteModal;

        if (!this.utils.isNull(id)) {
            this.toDeleteId = id;
        }
    }

    refreshUsers() {
        this.userRepository.all().then((result) => {
            this.context.users = result;
        });
    }

    confirmDelete() {
        this.userRepository.destroy(this.toDeleteId).then((result) => {
           this.toDeleteId = null;
           this.context.deleteModal = false;
           this._globalAlert.setAlerts('User has been deleted', 'success');
           this.refreshUsers();
        });
    }
}

register.viewControl('listusers-vc', ListUsersViewControl, [
    UserRepository,
    ui.animations.Animator
]);
