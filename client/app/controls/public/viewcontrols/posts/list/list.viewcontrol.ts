import {register} from 'platypus';
import BaseViewControl from '../../base.viewcontrol';
import PostRepository from '../../../../../repositories/post.repository';
import SingleViewControl from '../single/single.viewcontrol';

export default class ListPostsViewControl extends BaseViewControl {
	templateString = require('./list.viewcontrol.html');
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
