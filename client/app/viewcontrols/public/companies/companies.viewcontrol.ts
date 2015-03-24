/// <reference path="../../../../typings/tsd.d.ts" />

import plat = require('platypus');
import BaseViewControl = require('../../base.viewcontrol');

class CompaniesViewControl extends BaseViewControl {
	title = 'Innovation Depot | Member Companies';
 	templateString = require('./companies.viewcontrol.html');
 	context = {};
}

plat.register.viewControl('companies-vc', CompaniesViewControl);

export = CompaniesViewControl;