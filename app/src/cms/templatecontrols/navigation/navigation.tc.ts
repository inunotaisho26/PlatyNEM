import {ui, register} from 'platypus';
import DashboardViewControl from '../../viewcontrols/admin/dashboard/dashboard.vc';
import LogoutViewControl from '../../viewcontrols/admin/logout/logout.vc';

export default class AdminNavigation extends ui.TemplateControl {
    templateString: string = require('./navigation.tc.html');
    hasOwnContext: boolean = true;
    context: {
        logoView: typeof DashboardViewControl,
        menuItems: Array<{ title: string; view: Function; }>;
    } = {
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
