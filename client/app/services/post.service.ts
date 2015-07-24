import {register, async} from 'platypus';
import Crud from './crud.service';

export default class PostService extends Crud<server.IPost> {
	constructor() {
		super('posts');
	}

	all(published?: boolean, from?: number): plat.async.IThenable<Array<models.IPost>> {
		var query = '?published=' + published + '&from=' + from + '&count=10';
		return this._get(query);
	}
}

plat.register.injectable('postService', PostService);
