/// <reference path="../../../../references.d.ts" />

import plat = require('platypus');
import AdminBaseViewControl = require('../base.viewcontrol');

class DashboardViewControl extends AdminBaseViewControl {
	title = 'Innovation Depot Dashboard';
 	templateString = require('./dashboard.viewcontrol.html');
 	context = {};

 	navigatedTo() {
 		console.log(this.toolbar);
 	}
}

plat.register.viewControl('dashboard-vc', DashboardViewControl);

export = DashboardViewControl;