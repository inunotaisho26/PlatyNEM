/// <reference path="../../references.d.ts" />
/// <reference path="./server.model.d.ts" />

import plat = require('platypus');
import base = require('./base.model');

export class AlertFactory extends base.BaseFactory<IAlert> {
	_instantiate(alert: IAlert): IAlert {
		return {
			property: alert.property,
			message: alert.message
		}
	}
}

export interface IAlert {
	property?: string;
	message: string;
}
