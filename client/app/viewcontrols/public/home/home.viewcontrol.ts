/// <reference path="../../../../references.d.ts" />

import plat = require('platypus');
import BaseViewControl = require('../../base.viewcontrol');

class HomeViewControl extends BaseViewControl {
    title = 'BlogStarter | Just Start Writing';
    templateString = require('./home.viewcontrol.html');
    context = {};
    
    initialize() {
        console.log(this._globalAlert);
    }
}

plat.register.viewControl('', HomeViewControl);

export = HomeViewControl;