import {async, register, storage} from 'platypus';
import BaseRepository from '../repositories/base.repository';
import PostFactory from '../models/post/post.model';
import PostService from '../services/post.service';

export default class PostRepository extends BaseRepository<PostFactory, PostService, models.IPost> {
	protected _cache: plat.storage.Cache<models.IPost> = this._cacheFactory.create<models.IPost>('posts');

	all(published?: boolean, from?: number): plat.async.IThenable<Array<models.IPost>> {
		return this.service.all(published, from).then((results) => {
			if (published) {
				this._store(results);
			}

			return this.Factory.all(results);
		});
	}

	update(post: models.IPost, ...args: any[]): plat.async.IThenable<models.IPost> {
		return super.update(post).then(() => {
			this._store(post);
			return post;
		});
	}

	protected _store(posts: Array<models.IPost>): void;
	protected _store(post: models.IPost): void;
	protected _store(_posts: any) {
		var posts: Array<models.IPost> = _posts;

		if (!this._utils.isArray(posts)) {
			posts = [<any>posts];
		}

		this._utils.forEach((post) => {
			this._cache.put(<any>post.id, post);
		}, posts)
	}
}

plat.register.injectable('postRespository', PostRepository, [
	PostFactory,
	PostService
]);
