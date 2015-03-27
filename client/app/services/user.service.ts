/// <reference path="../../references.d.ts" />
/// <reference path="../models/server.model.d.ts" />

import plat = require('platypus');
import BaseService = require('./base.service');

class UserService extends BaseService {
	constructor() {
		super('users');
	}

	create(user: any, password: string): plat.async.IAjaxThenable<number> {
		var payload = this._utils.extend({}, user, {
			password: password
		});

		return super.create(payload);
	}
};

export = UserService;