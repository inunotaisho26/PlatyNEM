import {register, ui} from 'platypus';

export class PublicNavigation extends ui.TemplateControl {
    templateString: string = require('./navbar.tc.html');
    hasOwnContext: boolean = true;
    context: {
        logoView: string;
    } = {
        logoView: ''
    };
}

register.control('public-navigation', PublicNavigation);
