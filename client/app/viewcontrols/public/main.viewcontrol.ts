/// <reference path="../../../references.d.ts" />

import plat = require('platypus');
import BaseViewControl = require('../base.viewcontrol');
import HomeViewControl = require('./home/home.viewcontrol');
import LoginViewControl = require('./auth/login/login.viewcontrol');
import RegisterViewControl = require('./auth/register/register.viewcontrol');
import ListPostsViewControl = require('./posts/list/list.viewcontrol');
import SinglePostViewControl = require('./posts/single/single.viewcontrol');

class PublicViewControl extends BaseViewControl {
    templateString = require('./main.viewcontrol.html');
    context = {};
    constructor(router: plat.routing.Router) {
        super();

        router.configure([
            { pattern: '', view: HomeViewControl },
            { pattern: 'login', view: LoginViewControl },
            { pattern: 'register', view: RegisterViewControl },
            { pattern: 'posts', view: ListPostsViewControl },
            { pattern: 'posts/:id', view: SinglePostViewControl }
        ]);
    }
}

plat.register.viewControl('public-vc', PublicViewControl, [
    plat.routing.Router
]);

export = PublicViewControl;
