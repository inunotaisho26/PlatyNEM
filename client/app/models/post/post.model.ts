/// <reference path="../../../references.d.ts" />
/// <reference path="../server.model.d.ts" />

import plat = require('platypus');
import base = require('../base/base.model');
import UserFactory = require('../user/user.model');

class PostFactory extends base.BaseFactory<models.IPost> {
	constructor(private UserFactory: UserFactory) {
		super();
	}
	
	_instantiate(post: models.IPost): models.IPost {
		if (this.utils.isString(post.created)) {
			post.created = new Date(<string><any>post.created);	
		}
		
		return {
			title: decodeURI(post.title),
	        content: decodeURI(post.content),
	        userid: post.userid,
	        created: post.created,
	        published: post.published
		}
	}
}

export = PostFactory;

plat.register.injectable('postFactory', PostFactory, [
	UserFactory
], plat.register.injectable.FACTORY);
	