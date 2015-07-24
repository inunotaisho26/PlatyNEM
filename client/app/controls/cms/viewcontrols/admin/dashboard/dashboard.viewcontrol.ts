import {register} from 'platypus';
import CMSBaseViewControl from '../../base.viewcontrol';

export default class DashboardViewControl extends CMSBaseViewControl {
    title = 'Dashboard';
    templateString = require('./dashboard.viewcontrol.html');
    context = {};
}

register.viewControl('dashboard-vc', DashboardViewControl);
