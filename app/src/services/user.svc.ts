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

    login(user: models.IUser, password: string): async.IAjaxThenable<server.models.IUser> {
        return this.post<server.models.IUser>('login', {
            data: this.utils.extend({}, user, { password: password })
        });
    }

    update(user: models.IUser): async.IAjaxThenable<void> {
        return super.update(user, this.http.contentType.MULTIPART_FORM);
    }

    logout(): async.IAjaxThenable<boolean> {
        return this.post<boolean>('logout');
    }

    isAdmin(): async.IAjaxThenable<boolean> {
        return this.get<boolean>('admin');
    }

    loggedInUser(): async.IAjaxThenable<server.models.IUser> {
        return this.get<server.models.IUser>('me');
    }

    createResetToken(email: string): async.IAjaxThenable<any> {
        return this.post<any>('forgot', {
            data: {
                email: email
            }
        });
    }

    checkTokenExpiration(token: string): async.IAjaxThenable<boolean> {
        return this.get<boolean>('reset/' + token);
    }

    resetPassword(token: string, password: string): async.IAjaxThenable<any> {
        return this.post<any>('reset/' + token, {
            data: {
                password: password
            }
        });
    }
};
