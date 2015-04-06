/// <reference path="../../references.d.ts" />

import Base = require('../base.model');
var bcrypt: any = require('bcrypt-nodejs');

var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
var salt_work_factor = 10;

class Model extends Base<models.IUser> {
    generateHashedPassword(user, password): Thenable<string> {
        return new this.Promise((resolve, reject) => {
            if (!this.utils.isString(password) || password.length === 0 || !this.utils.isString(user.salt)) {
                reject();
            }

            bcrypt.hash(password, user.salt, null, (err, hash) => {
                if (err) {
                    reject(err);
                }
                resolve(hash);
            });
        });
    }

    generateSalt(password): Thenable<string> {
        return new this.Promise((resolve, reject) => {
            bcrypt.genSalt(salt_work_factor, (err, salt) => {
                if (err) {
                    reject(err);
                }
                resolve(salt);
            })
        });
    }

    authenticate(user: models.IUser, password: string): Thenable<boolean> {
        return this.generateHashedPassword(user, password).then((hash) => {
            return hash === user.password;
        });
    }

    validateProperties(user: models.IUser, options?: { checkPassword: boolean }): models.IValidationErrors {
        var validations: models.IValidationErrors = [
            this.validateFirstName(user.firstname),
            this.validateLastName(user.lastname),
            this.validateEmail(user.email)
        ];

        if (this.utils.isObject(options) && options.checkPassword) {
            validations.push(this.validatePassword(user.password));
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
