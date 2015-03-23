/// <reference path="../../typings/tsd.d.ts" />

import plat = require('platypus');

class BaseViewControl extends plat.ui.ViewControl {
	protected _Promise = plat.acquire(plat.async.IPromise);
}

export = BaseViewControl;
