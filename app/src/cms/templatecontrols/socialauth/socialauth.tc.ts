import {register, ui} from 'platypus';

export default class SocialAuth extends ui.TemplateControl {
	templateString = require('./socialauth.tc.html');
}

register.control('social-auth', SocialAuth);
