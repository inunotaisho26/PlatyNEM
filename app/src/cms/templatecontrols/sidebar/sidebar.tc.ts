import {ui, async, register} from 'platypus';
import ListPostsViewControl from '../../viewcontrols/admin/blog/list/list.vc';
import ListUsersViewControl from '../../viewcontrols/admin/users/list/list.vc';
import DashboardViewControl from '../../viewcontrols/admin/dashboard/dashboard.vc';

export default class Sidebar extends ui.TemplateControl {
    templateString: string = require('./sidebar.tc.html');
    hasOwnContext: boolean = true;
    context: { menuItems: Array<{ view: Function; title: string; }>; } = {
        menuItems: [
            {
                view: DashboardViewControl,
                title: 'Dashboard'
            },
            {
                view: ListPostsViewControl,
                title: 'Blog'
            },
            {
                view: ListUsersViewControl,
                title: 'Users'
            }
        ]
    };

    constructor(private Promise: async.IPromise) {
        super();
    }
}

register.control('sidebar', Sidebar, [
    async.IPromise
], true);
