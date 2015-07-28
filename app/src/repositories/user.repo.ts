import {async, register} from 'platypus';
import UserFactory from '../models/user';
import UserService from '../services/user.svc';
import BaseRepository from './crud.repo';

export default class UserRepository extends BaseRepository<UserFactory, UserService, models.IUser> {
    private currentUser: models.IUser;
    private currentUserPromise: async.IThenable<models.IUser>;

    create(user: any, password: string): async.IThenable<number> {
        var u = this.Factory.create(user);

        return this.service.create(u, password).then((id: number) => {
            user.id = id;
            return id;
        });
    }

    current(): async.IThenable<models.IUser> {
        if (this.currentUser) {
            return this.currentUserPromise = this.Promise.resolve(this.utils.clone(this.currentUser, true));
        } else if (this.utils.isPromise(this.currentUserPromise)) {
            return this.currentUserPromise.then((user) => {
                this.currentUser = user;
                this.currentUserPromise = null;
                return this.utils.clone(this.currentUser, true);
            });
        }

        return this.currentUserPromise = this.service.loggedInUser()
            .then((user) => {
               this.currentUser = user;
               return this.utils.clone(this.currentUser, true);
            });
    }

    login(user: any): async.IThenable<void> {
        var u = this.Factory.create(user);

        return this.service.login(u, user.password).then((user) => {
            this.currentUser = this.Factory.create(user);
        });
    }

    logout(): async.IThenable<void> {
        return this.service.logout().then(() => {
            this.currentUser = null;
            this.currentUserPromise = null;
        });
    }

    isAdmin(): async.IThenable<boolean> {
        return this.service.isAdmin();
    }

    createResetToken(email: string): async.IThenable<void> {
        return this.service.createResetToken(email);
    }

    checkTokenExpiration(token: string): async.IThenable<boolean> {
        return this.service.checkTokenExpiration(token);
    }

    resetPassword(token: string, password: string): async.IThenable<any> {
        return this.service.resetPassword(token, password);
    }
}

register.injectable('usersRepository', UserRepository, [
    UserFactory,
    UserService
]);
