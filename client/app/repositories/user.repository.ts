import {async, register} from 'platypus';
import UserFactory from '../models/user/user.model';
import UserService from '../services/user.service';
import BaseRepository from './base.repository';

export default class UserRepository extends BaseRepository<UserFactory, UserService, models.IUser> {
    private __currentUser: models.IUser;
    private __currentUserPromise: async.IThenable<models.IUser>;

    create(user: any, password: string) {
        var u = this.Factory.create(user);

        return this.service.register(u, password).then((id: number) => {
            user.id = id;
            return id;
        });
    }

    current(): async.IThenable<models.IUser> {
        if (this.__currentUser) {
            return this.__currentUserPromise = this._Promise.resolve(this._utils.clone(this.__currentUser, true));
        } else if (this._utils.isPromise(this.__currentUserPromise)) {
            return this.__currentUserPromise.then((user) => {
                this.__currentUser = user;
                this.__currentUserPromise = null;
                return this._utils.clone(this.__currentUser, true);
            });
        }

        return this.__currentUserPromise = this.service.loggedInUser()
            .then((user) => {
               this.__currentUser = user;
               return this._utils.clone(this.__currentUser, true);
            });
    }

    login(user: any): async.IThenable<void> {
        var u = this.Factory.create(user);

        return this.service.login(u, user.password).then((user) => {
            this.__currentUser = this.Factory.create(user);
        });
    }

    logout(): async.IThenable<void> {
        return this.service.logout().then(() => {
            this.__currentUser = null;
            this.__currentUserPromise = null;
        });
    }

    isAdmin(): async.IThenable<boolean> {
        return this.service.isAdmin();
    }

    createResetToken(email: string): async.IThenable<void> {
        return this.service.createResetToken(email);
    }

    checkTokenExpiration(token: string) {
        return this.service.checkTokenExpiration(token);
    }

    resetPassword(token: string, password: string) {
        return this.service.resetPassword(token, password);
    }
}

register.injectable('usersRepository', UserRepository, [
    UserFactory,
    UserService
]);
