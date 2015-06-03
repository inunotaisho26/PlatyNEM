/// <reference path="../../../../references.d.ts" />

import {ui, register, observable} from 'platypus';

class Htmlify extends ui.controls.InnerHtml {
	context: string;
	defaultLength = 150;
	options: observable.IObservableProperty<{ maxLength?: number; formatted?: boolean }>
	
	loaded() {
		var content = this.context;
		var options = this.options.value;
		var maxLen = options.maxLength || this.defaultLength;
		
		if (!options.formatted) {
			content = content.replace(/(<([^>]+)>)/ig, '');
			
			// Only abridge content that has been stripped of html tags
			if (!isNaN(Number(options.maxLength))) {
				content = this.abridge(content, maxLen);
			}
		}
		
		this.dom.setInnerHtml(this.element, content);
	}
	
	abridge(str: string, max: number, tail: string = '...') {
		var shortened = str.slice(0, max);
		return shortened + (shortened.length >= str.length ? '' : tail);
	}
}

register.control('htmlify', Htmlify);

export = Htmlify;
