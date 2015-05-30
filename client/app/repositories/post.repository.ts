/// <reference path="../../references.d.ts" />

import plat = require('platypus');
import BaseRepository = require('../repositories/base.repository');
import PostFactory = require('../models/post/post.model');
import PostService = require('../services/post.service');

class PostRepository extends BaseRepository<PostFactory, PostService, models.IPost> {
	
}

plat.register.injectable('postRespository', PostRepository, [
	PostFactory,
	PostService
]);

export = PostRepository;
