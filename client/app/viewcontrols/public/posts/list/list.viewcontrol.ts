/// <reference path="../../../../../references.d.ts" />

import {register} from 'platypus';
import BaseViewControl = require('../../../base.viewcontrol');

class ListPostsViewControl extends BaseViewControl {
	templateString = require('./list.viewcontrol');
	title = 'List Posts';
	context = {};
}

register.viewControl('listposts-vc', ListPostsViewControl);

export = ListPostsViewControl;
