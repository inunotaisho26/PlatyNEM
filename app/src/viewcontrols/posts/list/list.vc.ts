import {register} from 'platypus';
import BaseViewControl from '../../base.vc';
import PostRepository from '../../../repositories/post.repo';
import SingleViewControl from '../single/single.vc';

export default class ListPostsViewControl extends BaseViewControl {
	templateString = require('./list.vc.html');
	title = 'List Posts';
	context = {
		posts: <Array<models.IPost>>null,
		singleView: SingleViewControl
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

register.viewControl('listposts-vc', ListPostsViewControl, [
	PostRepository
]);
