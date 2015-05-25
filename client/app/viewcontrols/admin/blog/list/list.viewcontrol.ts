/// <reference path="../../../../../references.d.ts" />

import plat = require('platypus');
import AdminBaseViewControl = require('../../base.viewcontrol');
import ManagePostViewControl = require('../manage/manage.viewcontrol');

class ListPostsViewControl extends AdminBaseViewControl {
    title = 'List Blog Posts';
    templateString = require('./list.viewcontrol.html');
    context = {
        manageView: ManagePostViewControl
    };
}

plat.register.viewControl('adminlistposts-vc', ListPostsViewControl);

export = ListPostsViewControl;
