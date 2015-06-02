/// <reference path="../../../../../references.d.ts" />

import plat = require('platypus');
import BaseViewControl = require('../../../base.viewcontrol');

class SinglePostViewControl extends BaseViewControl {
	templateString = require('./single.viewcontrol');
	title = 'Single Post';
	context = {};
}

plat.register.viewControl('singlepost-vc', SinglePostViewControl);

export = SinglePostViewControl;
