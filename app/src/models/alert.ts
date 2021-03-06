import {register} from 'platypus';
import BaseFactory from './base';

export default class AlertFactory extends BaseFactory<models.IAlert> {
	_instantiate(alert: models.IAlert): models.IAlert {
		return {
			property: alert.property,
			message: alert.message
		};
	}
}

register.injectable('alertFactory', AlertFactory, null, register.injectable.FACTORY);
