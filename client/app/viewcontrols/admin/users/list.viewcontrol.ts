/// <reference path="../../../../references.d.ts" />

import plat = require('platypus');
import AdminBaseViewControl = require('../base.viewcontrol');

class ListUsersViewControl extends AdminBaseViewControl {
	title = 'All Users';
 	templateString = require('./list.viewcontrol.html');
 	context = {};
}

plat.register.viewControl('listusers-vc', ListUsersViewControl);

export = ListUsersViewControl;