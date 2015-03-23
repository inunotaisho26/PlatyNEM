/// <reference path="../../../typings/tsd.d.ts" />

import plat = require('platypus');
import BaseViewControl = require('../base.viewcontrol');

class CompaniesViewControl extends BaseViewControl {

}

plat.register.viewControl('companies-vc', CompaniesViewControl);

export = CompaniesViewControl;