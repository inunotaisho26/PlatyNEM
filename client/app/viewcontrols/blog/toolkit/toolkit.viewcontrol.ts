/// <reference path="../../../../references.d.ts" />

import plat = require('platypus');
import BaseViewControl = require('../../base.viewcontrol');

class ListViewControl extends BaseViewControl {
	title = 'URLs Gone Wild | Tools';
	templateString = require('./toolkit.viewcontrol.html');
	context = {};
}

plat.register.viewControl('listtools-vc', ListViewControl);

export = ListViewControl;
