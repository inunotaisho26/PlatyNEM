import {register} from 'platypus';
import BaseViewControl from '../../base.viewcontrol';
import PostRepository from '../../../../../repositories/post.repository';

export default class SinglePostViewControl extends BaseViewControl {
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

register.viewControl('singlepost-vc', SinglePostViewControl, [
	PostRepository
]);
