/// <reference path="../../references.d.ts" />
/// <reference path="../models/server.model.d.ts" />

import plat = require('platypus');
import models = require('../models/user.model');
import CrudService = require('./crud.service');

class UserService extends CrudService<server.IUser> {
	constructor() {
		super('users');
	}

	register(user: models.IUser, password: string): plat.async.IAjaxThenable<number> {
		return super.create(this._utils.extend({}, user, {
			password: password
		}));
	}

	login(user: models.IUser, password: string) {
		return this._post<server.IUser>({
			data: this._utils.extend({}, user, { password: password })
		}, 'login');
	}

	logout() {
		return this._post<boolean>('logout');
	}

	isContributor() {
		return this._get<boolean>('contributor');
	}
};

export = UserService;
