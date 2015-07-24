import {register, routing} from 'platypus';
import BaseViewControl from '../../base.viewcontrol';
import DashboardViewControl from '../dashboard/dashboard.viewcontrol';
import ListPostsViewControl from '../blog/list/list.viewcontrol';
import ManagePostViewControl from '../blog/manage/manage.viewcontrol';
import ListUsersViewControl from '../users/list/list.viewcontrol';
import EditUsersViewControl from '../users/manage/manage.viewcontrol';
import LogoutViewControl from '../logout/logout.viewcontrol';

export default class AdminViewControl extends BaseViewControl {
    templateString = require('./main.viewcontrol.html');
    context = {};
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
