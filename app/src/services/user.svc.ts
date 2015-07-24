import {async} from 'platypus';
import CrudService from './crud.svc';

export default class UserService extends CrudService<server.models.IUser> {
    constructor() {
        super('users');
    }

    register(user: models.IUser, password: string): async.IAjaxThenable<number> {
        return super.create(this.utils.extend({}, user, {
            password: password
        }), this.http.contentType.MULTIPART_FORM);
    }

    login(user: models.IUser, password: string) {
        return this._post<server.models.IUser>({
            data: this.utils.extend({}, user, { password: password })
        }, 'login');
    }

    update(user: models.IUser) {
        return super.update(user, this.http.contentType.MULTIPART_FORM);
    }

    logout() {
        return this._post<boolean>('logout');
    }

    isAdmin() {
        return this._get<boolean>('admin');
    }

    loggedInUser() {
        return this._get<server.models.IUser>('me');
    }

    createResetToken(email: string) {
        return this._post<any>({
            data: {
                email: email
            }
        }, 'forgot');
    }

    checkTokenExpiration(token: string) {
        return this._get<boolean>('reset', token);
    }

    resetPassword(token: string, password: string) {
        return this._post<any>({
            data: {
                password: password
            }
        }, 'reset', token);
    }
};
