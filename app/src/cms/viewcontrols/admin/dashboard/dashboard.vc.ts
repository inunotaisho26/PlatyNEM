import {register} from 'platypus';
import CMSBaseViewControl from '../../base.vc';

export default class DashboardViewControl extends CMSBaseViewControl {
    title = 'Dashboard';
    templateString = require('./dashboard.vc.html');
    context = {};
}

register.viewControl('dashboard-vc', DashboardViewControl);
