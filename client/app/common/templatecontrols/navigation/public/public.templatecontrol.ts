/// <reference path="../../../../../references.d.ts" />

import plat = require('platypus');
import BoxShadowViewControl = require('../../../../viewcontrols/tools/boxshadow/boxshadow.viewcontrol');
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
                title: 'Tools',
                view: null,
                subitems: [
                    {
                        title: 'Box Shadow Generator',
                        view: BoxShadowViewControl
                    }
                ]
            }
        ]
    };
}

plat.register.control('public-navigation', PublicNavigation);

export = PublicNavigation;
