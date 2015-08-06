import {register} from 'platypus';
import BaseViewControl from '../../base/base.vc';
import PostRepository from '../../../repositories/post.repo';

export default class SinglePostViewControl extends BaseViewControl {
	templateString: string = require('./single.vc.html');
	title: string = 'Single Post';
	context: {
        post: models.IPost;
    } = {
		post: null
	};

	constructor(private postRepository: PostRepository) {
		super();
	}

	navigatedTo(params: { slug: string; }): void {
		this.postRepository.read(params.slug).then((post) => {
			this.context.post = post;
		});
	}
}

register.viewControl('singlepost-vc', SinglePostViewControl, [
	PostRepository
]);
