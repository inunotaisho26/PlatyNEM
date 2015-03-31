/// <reference path="../../references.d.ts" />
/// <reference path="../models/server.model.d.ts" />

import plat = require('platypus');
import models = require('../models/user.model');
import UserService = require('../services/user.service');
import BaseRepository = require('../repositories/base.repository');

class UserRepository extends BaseRepository<models.UserFactory, UserService, models.IUser> {
	private __currentUser: models.IUser;
	
	create(user: any, password: string) {
		var u = this.Factory.create(user);
		
		return this.service.register(u, password).then((id: number) => {
			user.id = id;
			return id;
		});
	}

	login(user: any): plat.async.IThenable<void> {
		var u = this.Factory.create(user);
		return this.service.login(u, user.password).then((user) => {
			this.__currentUser = this.Factory.create(user);
		});
	}

	isContributor(): plat.async.IThenable<boolean> {
		return this.service.isContributor();
	}
}

plat.register.injectable('usersRepository', UserRepository, [
	models.UserFactory,
	UserService
]);

export = UserRepository;
