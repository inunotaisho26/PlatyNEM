/// <reference path="../../../../../references.d.ts" />

import plat = require('platypus')
import BaseViewControl = require('../../../base.viewcontrol');
import PostRepository = require('../../../../repositories/post.repository');

class ListPostsViewControl extends BaseViewControl {
	templateString = require('./list.viewcontrol.html');
	title = 'List Posts';
	context = {
		posts: <Array<models.IPost>>null
	};
	
	constructor(private postRepository: PostRepository) {
		super();
	}
	
	initialize() {
		this.postRepository.all().then((posts: models.IPost[]) => {
			this.context.posts = posts;
		});
	}
}

plat.register.viewControl('listposts-vc', ListPostsViewControl, [
	PostRepository
]);

export = ListPostsViewControl;
