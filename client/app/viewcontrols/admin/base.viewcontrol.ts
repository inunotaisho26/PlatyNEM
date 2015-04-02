/// <reference path="../../../references.d.ts" />

import plat = require('platypus');
import BaseViewControl = require('../base.viewcontrol');
import Toolbar = require('../../common/templatecontrols/toolbar/toolbar.templatecontrol');

class AdminBaseViewControl extends BaseViewControl {
	//toolbar: any = plat.acquire(Toolbar);
}

export = AdminBaseViewControl;
