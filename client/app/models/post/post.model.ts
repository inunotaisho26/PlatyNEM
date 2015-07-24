import {register} from 'platypus';
import BaseFactory from '../base/base.model';
import UserFactory from '../user/user.model';

export default class PostFactory extends BaseFactory<models.IPost> {
	constructor(private UserFactory: UserFactory) {
		super();
	}

	_instantiate(post: models.IPost): models.IPost {
		if (this.utils.isString(post.created)) {
			post.created = new Date(<string><any>post.created);
		}

		return {
			id: post.id,
			title: decodeURI(post.title),
	        content: decodeURI(post.content),
	        userid: post.userid,
			user: this.UserFactory.create(post.user),
	        created: post.created,
	        published: post.published
		}
	}
}

plat.register.injectable('postFactory', PostFactory, [
	UserFactory
], plat.register.injectable.FACTORY);
