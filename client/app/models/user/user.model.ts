/// <reference path="../../../references.d.ts" />
/// <reference path="../server.model.d.ts" />

import plat = require('platypus');
import base = require('../base/base.model');

class UserFactory extends base.BaseFactory<models.IUser> {
    _instantiate(user: models.IUser): models.IUser {
        return {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            avatar: user.avatar,
            role: user.role
        }
    }
}

export = UserFactory;

plat.register.injectable('userFactory', UserFactory, null, plat.register.injectable.FACTORY);
