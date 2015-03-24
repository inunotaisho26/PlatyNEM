/// <reference path="../../../typings/tsd.d.ts" />

import plat = require('platypus');
import BaseViewControl = require('../base.viewcontrol');
import CompaniesViewControl = require('./companies/companies.viewcontrol');
import HomeViewControl = require('./home/home.viewcontrol');
import JoinViewControl = require('./join/join.viewcontrol');
import StaffViewControl = require('./staff/staff.viewcontrol');

class PublicViewControl extends BaseViewControl {
	templateString = require('./main.viewcontrol.html');
	context = {};
	constructor(router: plat.routing.Router) {
	    super();

	    router.configure([
	    	{ pattern: '', view: HomeViewControl },
	    	{ pattern: 'companies', view: CompaniesViewControl },
	    	{ pattern: 'join', view: JoinViewControl },
	    	{ pattern: 'staff', view: StaffViewControl }
	    ]);
	}
}

plat.register.viewControl('public-vc', PublicViewControl, [
	plat.routing.Router
]);

export = PublicViewControl;
