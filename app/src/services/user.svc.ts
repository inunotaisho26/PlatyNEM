import {async} from 'platypus';
import CrudService from './crud.svc';

export default class UserService extends CrudService<server.models.IUser> {
    constructor() {
        super('users');
    }

    create(user: models.IUser, password: string): async.IAjaxThenable<number> {
        return super.create(this.utils.extend({}, user, {
            password: password
        }), this.http.contentType.MULTIPART_FORM);
    }

    login(user: models.IUser, password: string) {
        return this.post<server.models.IUser>('login', {
            data: this.utils.extend({}, user, { password: password })
        });
    }

    update(user: models.IUser) {
        return super.update(user, this.http.contentType.MULTIPART_FORM);
    }

    logout() {
        return this.post<boolean>('logout');
    }

    isAdmin() {
        return this.get<boolean>('admin');
    }

    loggedInUser() {
        return this.get<server.models.IUser>('me');
    }

    createResetToken(email: string) {
        return this.post<any>('forgot', {
            data: {
                email: email
            }
        });
    }

    checkTokenExpiration(token: string) {
        return this.get<boolean>('reset/' + token);
    }

    resetPassword(token: string, password: string) {
        return this.post<any>('reset/' + token, {
            data: {
                password: password
            }
        });
    }
};
