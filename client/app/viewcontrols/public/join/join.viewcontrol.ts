/// <reference path="../../../../typings/tsd.d.ts" />

import plat = require('platypus');
import BaseViewControl = require('../../base.viewcontrol');

class JoinViewControl extends BaseViewControl {
	title = 'Innovation Depot | Become a Member Company';
 	templateString = require('./join.viewcontrol.html');
 	context = {};
}

plat.register.viewControl('join-vc', JoinViewControl);

export = JoinViewControl;