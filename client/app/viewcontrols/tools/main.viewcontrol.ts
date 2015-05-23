/// <reference path="../../../references.d.ts" />

import plat = require('platypus');
import BaseViewControl = require('../base.viewcontrol');
import BoxShadowViewControl = require('./boxshadow/boxshadow.viewcontrol');

class ToolsViewControl extends BaseViewControl {
	templateString = '<plat-viewport></plat-viewport>';
	context = {};
	constructor(router: plat.routing.Router) {
		super();
		
		router.configure([
			{ pattern: 'boxshadow', view: BoxShadowViewControl }
		]);
	}
}

plat.register.viewControl('tools-vc', ToolsViewControl, [
	plat.routing.Router
]);

export = ToolsViewControl;

