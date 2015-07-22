import plat = require('platypus');

class Helpers {
	constructor(private document: any,
		private utils: plat.Utils) {}

	removeScript(match: string) {
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
		}, Array.prototype.slice.call(body.getElementsByTagName('script')))
	}
}

plat.register.injectable('helpers', Helpers, [
	plat.Document,
	plat.Utils
]);

export = Helpers;
