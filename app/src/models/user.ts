import {register} from 'platypus';
import BaseFactory from './base';

export default class UserFactory extends BaseFactory<models.IUser> {
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

register.injectable('userFactory', UserFactory, null, register.injectable.FACTORY);
