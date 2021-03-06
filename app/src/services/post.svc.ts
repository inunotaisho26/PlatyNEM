import {register, async} from 'platypus';
import Crud from './crud.svc';

export default class PostService extends Crud<server.models.IPost> {
	constructor() {
		super('posts');
	}

	all(options?: services.IPublishedQuery): async.IAjaxThenable<Array<models.IPost>> {
		return super.all(options);
	}
}

register.injectable('postService', PostService);
