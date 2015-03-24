/// <reference path="../../../../typings/tsd.d.ts" />

import plat = require('platypus');
import BaseViewControl = require('../../base.viewcontrol');

class ListUsersViewControl extends BaseViewControl {
	title = 'All Users';
 	templateString = require('./list.viewcontrol.html');
 	context = {};
}

plat.register.viewControl('listusers-vc', ListUsersViewControl);

export = ListUsersViewControl;