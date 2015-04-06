/// <reference path="../../../../../references.d.ts" />

import plat = require('platypus');
import DashboardViewControl = require('../../../../viewcontrols/admin/dashboard/dashboard.viewcontrol');
import LogoutViewControl = require('../../../../viewcontrols/admin/logout/logout.viewcontrol');

class AdminNavigation extends plat.ui.TemplateControl {
    templateString = require('./admin.templatecontrol.html');
    hasOwnContext = true;
    context = {
        logoView: DashboardViewControl,
        menuItems: [
            {
                title: 'Log Out',
                view: LogoutViewControl
            }
        ]
    };
}

plat.register.control('admin-navigation', AdminNavigation);

export = AdminNavigation;
