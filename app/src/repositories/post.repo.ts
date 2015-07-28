import {async, register, storage} from 'platypus';
import BaseRepository from '../repositories/crud.repo';
import PostFactory from '../models/post';
import PostService from '../services/post.svc';

export default class PostRepository extends BaseRepository<PostFactory, PostService, models.IPost> {
    constructor(public Factory: PostFactory, public service: PostService) {
        super(Factory, service, 'posts');
    }

	all(options?: services.IPublishedQuery): async.IThenable<Array<models.IPost>> {
		return super.all(options);
	}

    protected storeValue(post: models.IPost): void {
	   this.cache.put(<any>post.slug, post);
    }
}

register.injectable('postRespository', PostRepository, [
	PostFactory,
	PostService
]);
