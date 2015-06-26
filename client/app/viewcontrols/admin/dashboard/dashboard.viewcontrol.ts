/// <reference path="../../../../references.d.ts" />

import plat = require('platypus');
import AdminBaseViewControl = require('../base.viewcontrol');

class DashboardViewControl extends AdminBaseViewControl {
    title = 'Dashboard';
    templateString = require('./dashboard.viewcontrol.html');
    context = {};

    navigatedTo() {
        
    }
}

plat.register.viewControl('dashboard-vc', DashboardViewControl);

export = DashboardViewControl;