/// <reference path="../references.d.ts" />

import ValidationError = require('./error/error.model');
import utils = require('../config/utils/utils');
import PromiseStatic = require('es6-promise');

class Model<T> {
	Promise: typeof Promise = PromiseStatic.Promise;
	utils: typeof utils = utils;
	ValidationError: typeof ValidationError = ValidationError;

	protected isValidObject(obj: T): models.IValidationError {
		if (!this.utils.isObject(obj)) {
			return new ValidationError('Invalid object');
		}
	}

	protected isString(value: string, property?: string, displayProperty?: string): models.IValidationError {
		if (!this.utils.isString(value) || value.length <= 0) {
			return new ValidationError(displayProperty + ' can not be blank', property);
		}
	}

	protected isNumber(value: number, property?: string, displayProperty?: string): models.IValidationError {
		if (!this.utils.isNumber(value)) {
			return new ValidationError(displayProperty + ' can not be blank', property);
		}
	}
}

export = Model;
