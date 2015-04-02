/// <reference path="../../../../../references.d.ts" />

import plat = require('platypus');
import AdminBaseViewControl = require('../../base.viewcontrol');

class ManagePostViewControl extends AdminBaseViewControl {
	title = 'Manage Post';
 	templateString = require('./manage.viewcontrol.html');
 	context = {};
}

plat.register.viewControl('managepost-vc', ManagePostViewControl);

export = ManagePostViewControl;
