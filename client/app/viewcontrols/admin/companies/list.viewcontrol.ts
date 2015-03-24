/// <reference path="../../../../typings/tsd.d.ts" />

import plat = require('platypus');
import BaseViewControl = require('../../base.viewcontrol');

class ListCompaniesViewControl extends BaseViewControl {
	title = 'All Companies';
 	templateString = require('./list.viewcontrol.html');
 	context = {};
}

plat.register.viewControl('adminlistcompanies-vc', ListCompaniesViewControl);

export = ListCompaniesViewControl;