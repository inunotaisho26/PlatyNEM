import {register} from 'platypus';

export class PublicNavigation extends plat.ui.TemplateControl {
    templateString = require('./navbar.templatecontrol.html');
    hasOwnContext = true;
    context = {
        logoView: ''
    };
}


register.control('public-navigation', PublicNavigation);
