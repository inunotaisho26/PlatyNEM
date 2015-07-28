import {register, routing} from 'platypus';
import BaseViewControl from '../../base.vc';
import DashboardViewControl from '../dashboard/dashboard.vc';
import ListPostsViewControl from '../blog/list/list.vc';
import ManagePostViewControl from '../blog/manage/manage.vc';
import ListUsersViewControl from '../users/list/list.vc';
import EditUsersViewControl from '../users/manage/manage.vc';
import LogoutViewControl from '../logout/logout.vc';

export default class AdminViewControl extends BaseViewControl {
    templateString: string = require('./main.vc.html');
    context: {} = {};
    constructor(router: routing.Router) {
        super();

        router.configure([
            { pattern: '', view: DashboardViewControl },
            { pattern: 'posts', view: ListPostsViewControl },
            { pattern: 'posts/manage/:id', view: ManagePostViewControl },
            { pattern: 'users', view: ListUsersViewControl },
            { pattern: 'users/edit/:id', view: EditUsersViewControl },
            { pattern: 'logout', view: LogoutViewControl }
        ]);
    }
}

register.viewControl('admin-vc', AdminViewControl, [
    routing.Router
]);
