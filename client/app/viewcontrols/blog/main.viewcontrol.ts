/// <reference path="../../../references.d.ts" />

import plat = require('platypus');
import BaseViewControl = require('../base.viewcontrol');
import LoginViewControl = require('./auth/login/login.viewcontrol');
import RegisterViewControl = require('./auth/register/register.viewcontrol');
import ListToolsViewControl = require('./toolkit/toolkit.viewcontrol');
import ListPostsViewControl = require('./posts/list/list.viewcontrol');
import SinglePostViewControl = require('./posts/single/single.viewcontrol');
import ForgotPasswordViewControl = require('./auth/forgot/forgot.viewcontrol');
import ResetPasswordViewControl = require('./auth/reset/reset.viewcontrol');

class PublicViewControl extends BaseViewControl {
    templateString = require('./main.viewcontrol.html');
    context = {};
    constructor(router: plat.routing.Router) {
        super();

        router.configure([
            { pattern: '', view: ListPostsViewControl },
            { pattern: 'login', view: LoginViewControl },
            { pattern: 'register', view: RegisterViewControl },
            { pattern: 'toolkit', view: ListToolsViewControl },
            { pattern: 'posts/:id', view: SinglePostViewControl },
            { pattern: 'forgot-password', view: ForgotPasswordViewControl },
            { pattern: 'reset-password/:token', view: ResetPasswordViewControl }
        ]);
    }
}

plat.register.viewControl('public-vc', PublicViewControl, [
    plat.routing.Router
]);

export = PublicViewControl;
