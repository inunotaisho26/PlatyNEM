/// <reference path="../../../../../references.d.ts" />

import plat = require('platypus');
import PostRepository = require('../../../../repositories/post.repository');
import AdminBaseViewControl = require('../../base.viewcontrol');
import ManagePostViewControl = require('../manage/manage.viewcontrol');

class ListPostsViewControl extends AdminBaseViewControl {
    title = 'List Blog Posts';
    templateString = require('./list.viewcontrol.html');
    context = {
        manageView: ManagePostViewControl,
        posts: <Array<models.IPost>>null
    };
    
    constructor(private postRepository: PostRepository) {
        super();
    }
    
    navigatedTo() {
        this.postRepository.all().then((posts: Array<models.IPost>) => {
            this.context.posts = posts;
        });
    }
}

plat.register.viewControl('adminlistposts-vc', ListPostsViewControl, [
    PostRepository
]);

export = ListPostsViewControl;
