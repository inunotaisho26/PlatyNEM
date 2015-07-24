import {ui, register} from 'platypus';
import DashboardViewControl from '../../viewcontrols/admin/dashboard/dashboard.vc';
import LogoutViewControl from '../../viewcontrols/admin/logout/logout.vc';

export default class AdminNavigation extends ui.TemplateControl {
    templateString = require('./navigation.tc.html');
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
