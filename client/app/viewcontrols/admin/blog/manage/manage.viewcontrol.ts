/// <reference path="../../../../../references.d.ts" />

import plat = require('platypus');
import BaseViewControl = require('../../../base.viewcontrol');

class ManagePostViewControl extends BaseViewControl {
	title = 'Manage Post';
 	templateString = require('./manage.viewcontrol.html');
 	context = {};
}

plat.register.viewControl('managepost-vc', ManagePostViewControl);

export = ManagePostViewControl;
