/// <reference path="../../references.d.ts" />

import plat = require('platypus');
import BaseRepository = require('../repositories/base.repository');
import models = require('../models/post.model');
//import PostService = require('../services/post.service');

class PostRepository extends BaseRepository<models.PostFactory, any, models.IPost> {
	
}

plat.register.injectable('postRespository', PostRepository);

export = PostRepository;
