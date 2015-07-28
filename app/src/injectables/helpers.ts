import {Utils, register, Document as _Document} from 'platypus';

export default class Helpers {
	constructor(private document: any,
		private utils: Utils) {}

	removeScript(match: string): void {
		var head = this.document.head;
		var body = this.document.body;

		this.utils.forEach((el: HTMLScriptElement) => {
			if (el.src.indexOf(match) > -1) {
				head.removeChild(el);
			}
		}, Array.prototype.slice.call(head.getElementsByTagName('script')));

		this.utils.forEach((el: HTMLScriptElement) => {
			if (el.src.indexOf(match) > -1) {
				body.removeChild(el);
			}
		}, Array.prototype.slice.call(body.getElementsByTagName('script')));
	}
}

register.injectable('helpers', Helpers, [
	_Document,
	Utils
]);
