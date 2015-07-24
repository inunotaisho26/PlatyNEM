import Base from './crud.proc';

class Procedures extends Base<server.models.IUser> {
    create(user: server.models.IUser): Thenable<number> {
        return this.isUnique(user).then((row: { email: boolean }) => {
            var errors: server.errors.IValidationErrors = [];

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

    findByPasswordResetToken(token: string): Thenable<server.models.IUser> {
        return this.findBy(undefined, token).then((user: server.models.IUser) => {
           var errors: server.errors.IValidationErrors = [];

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

    findByEmail(email: string): Thenable<server.models.IUser> {
        return this.findBy(encodeURI(email));
    }

    protected getArgs(user: server.models.IUser): Array<any> {
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

    private isUnique(user: server.models.IUser): Thenable<{ email: boolean; }> {
        if (!this.utils.isObject(user)) {
            return this.Promise.reject('User is not valid');
        }

        return this.callProcedure('IsEmailUnique', {
            email: user.email
        }).then((rows) => {
            return <{ email: boolean; }>this.convertReturn(rows[0]);
        });
    }

    private findBy(email: string): Thenable<server.models.IUser>;
    private findBy(email: string, resetPasswordToken: string): Thenable<server.models.IUser>;
    private findBy(email: string, resetPasswordToken?: string): Thenable<server.models.IUser> {
        return this.callProcedure('GetUserBy', {
            email: email,
            resetPasswordToken: resetPasswordToken
        }).then((rows) => {
            return <server.models.IUser>this.convertReturn(rows[0]);
        });
    }
}

var procedures = new Procedures('User');
export default procedures;
