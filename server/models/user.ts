import {createHmac} from 'crypto';
import Base from './base';

var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

class Model extends Base<server.models.IUser> {
    hashedPassword(user: server.models.IUser, password: string): string {
        if (!this.utils.isString(password) || password.length === 0 || !this.utils.isString(user.salt)) {
            return '';
        }

        return createHmac('sha1', user.salt).update(password).digest('hex');
    }

    salt(): string {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    }

    authenticate(user: server.models.IUser, password: string): boolean {
        return this.hashedPassword(user, password) === user.hashedpassword;
    }

	protected validateProperties(user: server.models.IUser, options?: { checkPassword: boolean }): server.errors.IValidationErrors {
        var validations: server.errors.IValidationErrors = [
            this.validateFirstName(user.firstname),
            this.validateLastName(user.lastname),
            this.validateEmail(user.email)
        ];

        if (this.utils.isObject(options) && options.checkPassword) {
            validations.push(this.validatePassword(user.hashedpassword));
        }

        return validations;
    }

    protected validatePassword(password: string): server.errors.IValidationError {
        return this.isString(password, 'password', 'Password');
    }

    protected validateLastName(lastName: string): server.errors.IValidationError {
        return this.isString(lastName, 'lastname', 'Last Name');
    }

    protected validateFirstName(firstName: string): server.errors.IValidationError {
        return this.isString(firstName, 'firstname', 'First Name');
    }

    protected validateEmail(email: string): server.errors.IValidationError {
        if (!emailRegex.test(email)) {
            return new this.ValidationError('Please provide a valid email address.', 'email');
        }

        return this.isString(email, 'email', 'Email');
    }
}

var model = new Model();
export default model;
