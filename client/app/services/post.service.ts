/// <reference path="../../references.d.ts" />

import plat = require('platypus');
import Crud = require('./crud.service');

class PostService extends Crud<server.IPost> {
	constructor() {
		super('posts');
	}
}

plat.register.injectable('postService', PostService);

export = PostService;
