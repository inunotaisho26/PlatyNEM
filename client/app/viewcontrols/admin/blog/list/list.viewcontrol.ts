/// <reference path="../../../../../typings/tsd.d.ts" />

import plat = require('platypus');
import BaseViewControl = require('../../../base.viewcontrol');

class ListPostsViewControl extends BaseViewControl {
	title = 'List Blog Posts';
 	templateString = require('./list.viewcontrol.html');
 	context = {};
}

plat.register.viewControl('adminlistposts-vc', ListPostsViewControl);

export = ListPostsViewControl;