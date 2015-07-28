import {register} from 'platypus';
import BaseFactory from './base';
import UserFactory from './user';

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
			title: post.title,
	        content: post.content,
	        userid: post.userid,
			user: this.UserFactory.create(post.user),
	        created: post.created,
	        published: post.published
		}
	}
}

register.injectable('postFactory', PostFactory, [
	UserFactory
], register.injectable.FACTORY);
