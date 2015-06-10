/// <reference path="../../references.d.ts" />
/// <reference path="../models/server.model.d.ts" />

import plat = require('platypus');
import CrudService = require('./crud.service');

class UserService extends CrudService<server.IUser> {
    constructor() {
        super('users');
    }

    register(user: models.IUser, password: string): plat.async.IAjaxThenable<number> {
        return super.create(this._utils.extend({}, user, {
            password: password
        }), this._http.contentType.MULTIPART_FORM);
    }

    login(user: models.IUser, password: string) {
        return this._post<server.IUser>({
            data: this._utils.extend({}, user, { password: password })
        }, 'login');
    }
    
    update(user: models.IUser) {
        return super.update(user, this._http.contentType.MULTIPART_FORM);
    }

    logout() {
        return this._post<boolean>('logout');
    }

    isAdmin() {
        return this._get<boolean>('admin');
    }
    
    loggedInUser() {
        return this._get<server.IUser>('me');
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

export = UserService;
