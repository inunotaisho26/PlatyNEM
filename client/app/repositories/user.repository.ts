/// <reference path="../../references.d.ts" />
/// <reference path="../models/server.model.d.ts" />

import plat = require('platypus');
import models = require('../models/user.model');
import UserService = require('../services/user.service');
import repositories = require('../repositories/base.repository');

export class UserRepository extends repositories.BaseRepository<models.UserFactory, UserService, models.IUser> {
	create(user: any, password: string) {
		var u = this.Factory.create(user);
		console.log('factory user', u);
		return this.service.create(u, password).then((id: number) => {
			user.id = id;
			return id;
		});
	}
}

plat.register.injectable('usersRepository', UserRepository, [
	models.UserFactory,
	UserService
]);