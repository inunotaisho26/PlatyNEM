import * as utils from 'lodash';
import {Promise} from 'es6-promise';
import ValidationError from '../errors/validation.err';

export default class Model<T> {
	protected Promise: typeof Promise = Promise;
	protected utils: typeof utils = utils;
	protected ValidationError: typeof ValidationError = ValidationError;

	validate(obj: T, options?: any): Thenable<server.errors.IValidationErrors> {
		if (!this.utils.isUndefined(this.isValidObject(obj))) {
            return this.Promise.reject([this.isValidObject(obj)]);
        }

		return this.Promise.resolve<server.errors.IValidationErrors>(this.validateProperties(obj, options)).then((errors) => {
            errors = this.filterValidations(errors);

            if (!this.utils.isEmpty(errors)) {
                throw errors;
            }

            return errors;
        });
	}

    protected validateProperties(obj: T, options?: any): any {
        return [];
    }

    protected isValidObject(obj: T): server.errors.IValidationError {
        if (!this.utils.isObject(obj)) {
            return new this.ValidationError('Invalid object');
        }
    }

    protected isString(value: string, property?: string, displayProperty?: string): server.errors.IValidationError {
        if (!this.utils.isString(value) || value.length <= 0) {
            return new this.ValidationError(displayProperty + ' can not be blank', property);
        }
    }

    protected isNumber(value: number, property?: string, displayProperty?: string): server.errors.IValidationError {
        if (!this.utils.isNumber(value)) {
            return new this.ValidationError(displayProperty + ' can not be blank', property);
        }
    }

    protected filterValidations(validations: server.errors.IValidationErrors): server.errors.IValidationErrors {
		return this.utils.filter(validations, (validation) => {
			return !this.utils.isUndefined(validation);
		});
    }
}
