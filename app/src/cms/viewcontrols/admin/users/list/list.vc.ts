import {ui, register} from 'platypus';
import CMSBaseViewControl from '../../../base.vc';
import ManageUserViewControl from '../manage/manage.vc';
import UserRepository from '../../../../../repositories/user.repo';

export default class ListUsersViewControl extends CMSBaseViewControl {
    title: string = 'All Users';
    templateString: string = require('./list.vc.html');
    context: {
        users: Array<models.IUser>;
        manageView: typeof ManageUserViewControl;
        deleteModal: boolean;
    } = {
        users: null,
        manageView: ManageUserViewControl,
        deleteModal: false
    };

    toDeleteId: string;

    constructor(private userRepository: UserRepository,
        private animator: ui.animations.Animator) {
        super();
    }

    initialize(): void {
        var context = this.context;

        this.refreshUsers();
    }

    toggleDeleteModal(id?: string): void {
        var context = this.context;

        context.deleteModal = !context.deleteModal;

        if (!this.utils.isNull(id)) {
            this.toDeleteId = id;
        }
    }

    refreshUsers(): void {
        this.userRepository.all().then((result) => {
            this.context.users = result;
        });
    }

    confirmDelete(): void {
        this.userRepository.destroy(this.toDeleteId).then((result) => {
           this.toDeleteId = null;
           this.context.deleteModal = false;
           this.globalAlert.setAlerts('User has been deleted', 'success');
           this.refreshUsers();
        });
    }
}

register.viewControl('listusers-vc', ListUsersViewControl, [
    UserRepository,
    ui.animations.Animator
]);
