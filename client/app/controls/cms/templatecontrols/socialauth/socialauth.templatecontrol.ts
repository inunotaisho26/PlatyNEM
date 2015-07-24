import {register, ui} from 'platypus';

export default class SocialAuth extends ui.TemplateControl {
	templateString = require('./socialauth.templatecontrol.html');
}

register.control('social-auth', SocialAuth);
