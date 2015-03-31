/// <reference path="../../../../references.d.ts" />

import plat = require('platypus');

class Alert extends plat.ui.TemplateControl {
	templateString = require('./alert.templatecontrol.html');
	context = {
		alerts: []
	};

	dismiss() {
		this.context.alerts = [];
	}
}

plat.register.control('alert', Alert);
