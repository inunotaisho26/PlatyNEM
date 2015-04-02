/// <reference path="../../../../../references.d.ts" />

import plat = require('platypus');
import AdminBaseViewControl = require('../../base.viewcontrol');

class ListPostsViewControl extends AdminBaseViewControl {
	title = 'List Blog Posts';
 	templateString = require('./list.viewcontrol.html');
 	context = {};
}

plat.register.viewControl('adminlistposts-vc', ListPostsViewControl);

export = ListPostsViewControl;
