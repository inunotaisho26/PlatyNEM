import {ui, async, register} from 'platypus';
import ListPostsViewControl from '../../viewcontrols/admin/blog/list/list.viewcontrol';
import ListUsersViewControl from '../../viewcontrols/admin/users/list/list.viewcontrol';
import DashboardViewControl from '../../viewcontrols/admin/dashboard/dashboard.viewcontrol';

export default class Sidebar extends ui.TemplateControl {
    templateString = require('./sidebar.templatecontrol.html');
    hasOwnContext = true;
    context = {
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
