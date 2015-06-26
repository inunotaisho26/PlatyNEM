/// <reference path="../../references.d.ts" />

import Base = require('../base.model');
var bcrypt: any = require('bcrypt-nodejs');

import crypto = require('crypto');
var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
var salt_work_factor = 10;

class Model extends Base<models.IUser> {
    generateHashedPassword(user, password): string {
        if (!this.utils.isString(password) || password.length === 0 || !this.utils.isString(user.salt)) {
            return '';
        }

        return crypto.createHmac('sha1', user.salt).update(password).digest('hex');
    }

    generateSalt(password): string {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    }

    authenticate(user: models.server.IUser, password: string): boolean {
        return this.generateHashedPassword(user, password) === user.hashedpassword;
    }

    validateProperties(user: models.server.IUser, options?: { checkPassword: boolean }): models.IValidationErrors {
        var validations: models.IValidationErrors = [
            this.validateFirstName(user.firstname),
            this.validateLastName(user.lastname),
            this.validateEmail(user.email)
        ];

        if (this.utils.isObject(options) && options.checkPassword) {
            validations.push(this.validatePassword(user.hashedpassword));
        }

        return validations;
    }

    validatePassword(password: string): models.IValidationError {
        return this.isString(password, 'password', 'Password');
    }

    validateLastName(lastName: string): models.IValidationError {
        return this.isString(lastName, 'lastname', 'Last Name');
    }

    validateFirstName(firstName: string): models.IValidationError {
        return this.isString(firstName, 'firstname', 'First Name');
    }

    validateEmail(email: string): models.IValidationError {
        if (!emailRegex.test(email)) {
            return new this.ValidationError('Please provide a valid email address.', 'email');
        }
        
        return this.isString(email, 'email', 'Email');
    }
}

var model = new Model();
export = model;
