/// <reference path="../../../../references.d.ts" />

import plat = require('platypus');

class LocalAlert extends plat.ui.TemplateControl {
    templateString = require('./localalert.templatecontrol.html');
    context = {
        alerts: []
    };

    dismiss() {
        this.context.alerts = [];
    }
}

plat.register.control('local-alert', LocalAlert);
