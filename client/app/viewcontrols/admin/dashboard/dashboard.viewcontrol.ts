/// <reference path="../../../../references.d.ts" />

import plat = require('platypus');
import BaseViewControl = require('../../base.viewcontrol');

class DashboardViewControl extends BaseViewControl {
	title = 'Innovation Depot Dashboard';
 	templateString = require('./dashboard.viewcontrol.html');
 	context = {};
}

plat.register.viewControl('dashboard-vc', DashboardViewControl);

export = DashboardViewControl;