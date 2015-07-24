/// <reference path="../references.d.ts" />

import ValidationError = require('./error/error.model');
import utils = require('../config/utils/utils');
import PromiseStatic = require('es6-promise');

class Model<T> {
    Promise: typeof Promise = PromiseStatic.Promise;
    utils: typeof utils = utils;
    ValidationError: typeof ValidationError = ValidationError;

    validate(obj: T, options?: any) {
        if (this.isValidObject(obj) !== undefined) {
            return this.Promise.reject([this.isValidObject(obj)]);
        }

        return this.Promise.resolve<models.server.IValidationErrors>(this.validateProperties(obj, options)).then((errors) => {
             errors = this.filterValidations(errors);

             if (this.utils.isArray(errors) && errors.length > 0) {
                 throw errors;
             }

             return errors;
        });
    }

    validateProperties(obj: T, options?: any) {
        return [];
    }

    filterValidations(validations: models.server.IValidationErrors) {
        var i: number = 0;
        var validation: any;
        var errors: models.server.IValidationErrors = [];

        for (i = 0; i < validations.length; i++) {
            validation = validations[i];
            if (validation !== undefined) {
                errors.push(validation);
            }
        }

        return errors;
    }

    protected isValidObject(obj: T): models.server.IValidationError {
        if (!this.utils.isObject(obj)) {
            return new ValidationError('Invalid object');
        }
    }

    protected isString(value: string, property?: string, displayProperty?: string): models.server.IValidationError {
        if (!this.utils.isString(value) || value.length <= 0) {
            return new ValidationError(displayProperty + ' can not be blank', property);
        }
    }

    protected isNumber(value: number, property?: string, displayProperty?: string): models.server.IValidationError {
        if (!this.utils.isNumber(value)) {
            return new ValidationError(displayProperty + ' can not be blank', property);
        }
    }
}

export = Model;
