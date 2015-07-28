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
                return this.callProcedure('CreateUserPasswordResetToken', [
                    { email: email },
                    { resetpasswordtoken: token },
                    { days: 3 }
                ]).then((results) => {
                    var user: { userid: number; } = results[0][0];

                    if (this.utils.isObject(user) && this.utils.isNumber(user.userid)) {
                        return user.userid;
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

    protected getArgs(user: server.models.IUser): Array<any> {
        if (!this.utils.isObject(user)) {
            return [];
        }

        return [
            { firstname: user.firstname },
            { lastname: user.lastname },
            { email: user.email },
            { role: user.role },
            { avatar: user.avatar },
            { hashedpassword: user.hashedpassword },
            { salt: user.salt }
        ];
    }

    private isUnique(user: server.models.IUser): Thenable<void> {
        if (!this.utils.isObject(user)) {
            return this.Promise.reject('User is not valid');
        }

        return this.callProcedure('IsUserUnique', [
            { email: user.email },
            { id: user.id }
        ]).then((rows) => {
            return <{ email: boolean; }>rows[0][0];
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
        return this.callProcedure('GetUserBy', [
            { email: email },
            { resetpasswordtoken: resetpasswordtoken }
        ]).then((rows) => {
            return <server.models.IUser>rows[0][0];
        });
    }
}

var procedures = new Procedures('User');
export default procedures;
