/// <reference path="../../../typings/tsd.d.ts" />

import plat = require('platypus');
import BaseViewControl = require('../base.viewcontrol');
import DashboardViewControl = require('./dashboard/dashboard.viewcontrol');
import ListPostsViewControl = require('./blog/list/list.viewcontrol');
import ManagePostViewControl = require('./blog/manage/manage.viewcontrol');
import ListCompaniesViewControl = require('./companies/list.viewcontrol');
import ListUsersViewControl = require('./users/list.viewcontrol');

class AdminViewControl extends BaseViewControl {
	templateString = require('./main.viewcontrol.html');
	context = {};
	constructor(router: plat.routing.Router) {
	    super();

	    router.configure([
			{ pattern: '', view: DashboardViewControl },
			{ pattern: 'companies', view: ListCompaniesViewControl },
			{ pattern: 'posts', view: ListPostsViewControl },
			{ pattern: 'posts/manage/:id', view: ManagePostViewControl },
	    	{ pattern: 'users', view: ListUsersViewControl }
	    ]);
	}
}

plat.register.viewControl('admin-vc', AdminViewControl, [
	plat.routing.Router
]);

export = AdminViewControl;