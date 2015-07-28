import {register} from 'platypus';
import BaseViewControl from '../../base.vc';
import PostRepository from '../../../repositories/post.repo';

export default class SinglePostViewControl extends BaseViewControl {
	templateString = require('./single.vc.html');
	title = 'Single Post';
	context = {
		post: <models.IPost>null
	};

	constructor(private postRepository: PostRepository) {
		super();
	}

	navigatedTo(params: any) {
		if (!isNaN(Number(params.id))) {
			this.postRepository.read(params.id).then((post) => {
				this.context.post = post;
			});
		}
	}
}

register.viewControl('singlepost-vc', SinglePostViewControl, [
	PostRepository
]);
