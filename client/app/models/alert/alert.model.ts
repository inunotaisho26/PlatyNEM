/// <reference path="../../../references.d.ts" />
/// <reference path="../server.model.d.ts" />

import plat = require('platypus');
import base = require('../base/base.model');

class AlertFactory extends base.BaseFactory<models.IAlert> {
	_instantiate(alert: models.IAlert): models.IAlert {
		return {
			property: alert.property,
			message: alert.message
		}
	}
}

export = AlertFactory;

plat.register.injectable('alertFactory', AlertFactory, null, plat.register.injectable.FACTORY);
