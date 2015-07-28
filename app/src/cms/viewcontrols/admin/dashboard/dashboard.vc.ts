import {register} from 'platypus';
import CMSBaseViewControl from '../../base.vc';

export default class DashboardViewControl extends CMSBaseViewControl {
    title: string = 'Dashboard';
    templateString: string = require('./dashboard.vc.html');
    context: {} = {};
}

register.viewControl('dashboard-vc', DashboardViewControl);
