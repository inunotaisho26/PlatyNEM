import Base from './crud.proc';

class Procedures extends Base<server.models.IUser> {
    create(user: server.models.IUser): Thenable<number> {
        return this.isUnique(user).then(() => {
            return super.create(user);
        });
    }

    update(user: server.models.IUser): Thenable<void> {
        return this.isUnique(user).then(() => {
            return super.update(user);
        });
    }

    createUserPasswordResetToken(email: string, token: string): Thenable<number> {
        return this.findBy(email).then((user) => {
           if (!this.utils.isNull(user)) {
               return this.callProcedure('CreateUserPasswordResetToken', {
                   email: email,
                   resetpasswordtoken: token,
                   days: 3
               }).then((result: { userid: number; }) => {
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
               errors.push(new this.ValidationError('Please request a new password reset.'));
           } else {
               return user;
           }

           throw errors;
        });
    }

    findByEmail(email: string): Thenable<server.models.IUser> {
        return this.findBy(email);
    }

    protected getArgs(user: server.models.IUser): server.models.IUser {
        if (!this.utils.isObject(user)) {
            return <any>{};
        }

        return {
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            hashedpassword: user.hashedpassword,
            salt: user.salt
        };
    }

    private isUnique(user: server.models.IUser): Thenable<void> {
        if (!this.utils.isObject(user)) {
            return this.Promise.reject('User is not valid');
        }

        return this.callProcedure('IsUserUnique', {
            id: user.id,
            email: user.email
        }).then((rows) => {
            return <{ email: boolean; }>this.convertReturn(rows[0] || {});
        }).then((row: { email: boolean }) => {
            var errors: server.errors.IValidationErrors = [];

            if (!!row.email) {
                errors.push(new this.ValidationError('Email address has already been registered.'));
            }

            if (errors.length > 0) {
                throw errors;
            }
        });
    }

    private findBy(email: string): Thenable<server.models.IUser>;
    private findBy(email: string, resetpasswordtoken: string): Thenable<server.models.IUser>;
    private findBy(email: string, resetpasswordtoken?: string): Thenable<server.models.IUser> {
        return this.callProcedure('GetUserBy', {
            email: email,
            resetpasswordtoken: resetpasswordtoken
        }).then((rows) => {
            return <server.models.IUser>this.convertReturn(rows[0]);
        });
    }
}

var procedures = new Procedures('User');
export default procedures;
