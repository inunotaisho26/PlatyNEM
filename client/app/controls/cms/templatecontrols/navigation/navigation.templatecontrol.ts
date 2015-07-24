import {ui, register} from 'platypus';
import DashboardViewControl from '../../viewcontrols/admin/dashboard/dashboard.viewcontrol';
import LogoutViewControl from '../../viewcontrols/admin/logout/logout.viewcontrol';

export default class AdminNavigation extends ui.TemplateControl {
    templateString = require('./navigation.templatecontrol.html');
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

register.control('admin-navigation', AdminNavigation);
