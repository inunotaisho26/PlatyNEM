/// <reference path="../../typings/tsd.d.ts" />

import plat = require('platypus');
import PublicViewControl = require('../viewcontrols/public/main.viewcontrol');
import AdminViewControl = require('../viewcontrols/admin/main.viewcontrol');

export class App extends plat.App {
	constructor(router: plat.routing.Router) {
		super();

		router.configure([
			{ pattern: '', view: PublicViewControl },
			{ pattern: 'admin', view: AdminViewControl }
		]);
	}
}

plat.register.app('depot', App, [
	plat.routing.Router
]);
