/// <reference path="../../../references.d.ts" />

import Base = require('./base');

class UserProcedures extends Base<number, models.IUser, models.IUser, void> {
	constructor() {
		super('User');
	}

	create(user: models.IUser): Thenable<number> {
		return this.isUnique(user).then((row: { email: boolean }) => {
			var errors: models.IValidationErrors = [];

			if (!!row.email) {
				return this.findByEmail(user.email).then<any>((user) => {
					errors.push(new this.ValidationError('Email address has already been registered.'));
					console.log(errors);
					throw errors;
				});
			}

			if (errors.length > 0) {
				console.log(errors);
				throw errors;
			}

			return super.create(user);
		});
	}

	isUnique(user: models.IUser): Thenable<{ email: boolean }> {
		if (!this.utils.isObject(user)) {
			return this.Promise.reject('User is not valid');
		}

		return this.callProcedure('IsEmailUnique', [
			user.email
		]).then((rows) => {
			return rows[0][0];
		});
	}

	getArgs(user: models.IUser): Array<any> {
		if (!this.utils.isObject(user)) {
			return [];
		}

		return [
			encodeURI(user.firstname),
			encodeURI(user.lastname),
			encodeURI(user.email),
			encodeURI(user.role),
			user.password,
			user.salt
		];
	}

	findByEmail(email: string): Thenable<models.IUser> {
		return this.findBy(encodeURI(email));
	}

	findBy(email: string): Thenable<models.IUser> {
		return this.callProcedure('GetUserBy', [email]).then((rows) => {
			return rows[0][0];
		});
	}
}

var procedures = new UserProcedures();
export = procedures;