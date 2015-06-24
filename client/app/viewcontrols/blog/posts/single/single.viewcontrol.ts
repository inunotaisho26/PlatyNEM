/// <reference path="../../../../../references.d.ts" />

import plat = require('platypus');
import BaseViewControl = require('../../../base.viewcontrol');
import PostRepository = require('../../../../repositories/post.repository');

class SinglePostViewControl extends BaseViewControl {
	templateString = require('./single.viewcontrol.html');
	title = 'Single Post';
	context = {
		post: <models.IPost>null
	};
	
	constructor(private postRepository: PostRepository) {
		super();
	}
	
	navigatedTo(params: any) {
		if (!isNaN(Number(params.id))) {
			this.postRepository.one(params.id).then((post) => {
				this.context.post = post;
			});
		}
	}
}

plat.register.viewControl('singlepost-vc', SinglePostViewControl, [
	PostRepository
]);

export = SinglePostViewControl;
