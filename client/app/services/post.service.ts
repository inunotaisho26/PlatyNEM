/// <reference path="../../references.d.ts" />

import plat = require('platypus');
import Crud = require('./crud.service');

class PostService extends Crud<server.IPost> {
	constructor() {
		super('posts');
	}
	
	all(published?: boolean, from?: number): plat.async.IThenable<Array<models.IPost>> {
		var query = '?published=' + published + '&from=' + from + '&count=10';
		return this._get(query);
	}
}

plat.register.injectable('postService', PostService);

export = PostService;
