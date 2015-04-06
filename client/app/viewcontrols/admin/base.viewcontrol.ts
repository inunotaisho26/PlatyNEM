/// <reference path="../../../references.d.ts" />

import plat = require('platypus');
import BaseViewControl = require('../base.viewcontrol');

class AdminBaseViewControl extends BaseViewControl {
    toolbar: any = plat.acquire('toolbar');
}

export = AdminBaseViewControl;
