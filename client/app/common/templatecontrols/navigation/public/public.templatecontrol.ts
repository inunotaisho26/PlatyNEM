/// <reference path="../../../../../references.d.ts" />

import plat = require('platypus');
import LoginViewControl = require('../../../../viewcontrols/blog/auth/login/login.viewcontrol');
import RegisterViewControl = require('../../../../viewcontrols/blog/auth/register/register.viewcontrol');
import HomeViewControl = require('../../../../viewcontrols/blog/home/home.viewcontrol');

class PublicNavigation extends plat.ui.TemplateControl {
    templateString = require('./public.templatecontrol.html');
    hasOwnContext = true;
    context = {
        logoView: HomeViewControl,
        menuItems: [
            {
                title: 'Login',
                view: LoginViewControl
            },
            {
                title: 'Register',
                view: RegisterViewControl
            }
        ]
    };
}

plat.register.control('public-navigation', PublicNavigation);

export = PublicNavigation;
