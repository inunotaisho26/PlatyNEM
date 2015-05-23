/// <reference path="../../../../references.d.ts" />

import plat = require('platypus');
import ListPostsViewControl = require('../../../viewcontrols/admin/blog/list/list.viewcontrol');
import ListUsersViewControl = require('../../../viewcontrols/admin/users/list/list.viewcontrol');
import DashboardViewControl = require('../../../viewcontrols/admin/dashboard/dashboard.viewcontrol');

class Sidebar extends plat.ui.TemplateControl {
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

    constructor(private Promise: plat.async.IPromise) {
        super();
    }

    // register(control: any) {
    //  console.log(control);
    // }
}

plat.register.control('sidebar', Sidebar, [
    plat.async.IPromise
], true);

export = Sidebar;
