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
    
    createUserPasswordResetToken(email: string, token: string): Thenable<number> {
        return this.findBy(email).then((user) => {
           if (!this.utils.isNull(user)) {
               return this.callProcedure('CreateUserPasswordResetToken', [email, token]).then((rows) => {
                  var result: { userid: number; } = rows[0][0];
                  
                  if (this.utils.isObject(result) && this.utils.isNumber(result.userid)) {
                      return result.userid;
                  } 
               });
           } 
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

    getArgs(user: models.server.IUser): Array<any> {
        if (!this.utils.isObject(user)) {
            return [];
        }

        return [
            encodeURI(user.firstname),
            encodeURI(user.lastname),
            encodeURI(user.email),
            encodeURI(user.role),
            user.avatar,
            user.hashedpassword,
            user.salt
        ];
    }

    findByPasswordResetToken(token: string): Thenable<models.IUser> {
        return this.findBy(undefined, token).then((user: models.server.IUser) => {
           var errors: models.IValidationErrors = [];
           
           if (!this.utils.isObject(user)) {
               errors.push(new this.ValidationError('Invalid password reset request.'));
           } else if (user.resetPasswordExpires < (new Date())) {
               errors.push(new this.ValidationError('Password reset has expired.', 'resetPasswordExpires'));
           } else {
               return user;
           }
           
           throw errors;
        });
    }

    findByEmail(email: string): Thenable<models.IUser> {
        return this.findBy(encodeURI(email));
    }

    findBy(email: string): Thenable<models.IUser>;
    findBy(email: string, resetPasswordToken: string): Thenable<models.IUser>;
    findBy(email: string, resetPasswordToken?: string): Thenable<models.IUser> {
        return this.callProcedure('GetUserBy', [email, resetPasswordToken]).then((rows) => {
            return rows[0][0];
        });
    }
}

var procedures = new UserProcedures();
export = procedures;