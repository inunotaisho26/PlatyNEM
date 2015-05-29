/// <reference path="../../references.d.ts" />
/// <reference path="./server.model.d.ts" />

import plat = require('platypus');
import base = require('./base.model');
import user = require('./user.model');

export class PostFactory extends base.BaseFactory<IPost> {
	constructor(private UserFactory: user.UserFactory) {
		super();
	}
	
	_instantiate(post: IPost): IPost {
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

export interface IPost extends base.IBaseModel {
    title?: string;
    content?: string;
    userid?: number;
    user?: user.IUser;
    created?: Date;
    published?: boolean;
}

plat.register.injectable('postFactory', PostFactory, [
	user.UserFactory
], plat.register.injectable.FACTORY);
	