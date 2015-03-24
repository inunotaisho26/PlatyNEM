/// <reference path="../../../../typings/tsd.d.ts" />

import plat = require('platypus');
import BaseViewControl = require('../../base.viewcontrol');

class StaffViewControl extends BaseViewControl {
	title = 'Innovation Depot | Our Staff';
 	templateString = require('./staff.viewcontrol.html');
 	context = {};
}

plat.register.viewControl('staff-vc', StaffViewControl);

export = StaffViewControl;