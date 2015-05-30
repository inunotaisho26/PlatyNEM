/// <reference path="../../../references.d.ts" />

import plat = require('platypus');
var quill = require('quill');

export function quillFactory() {
	return quill;
}

plat.register.injectable('quillFactory', quillFactory, null, plat.register.injectable.STATIC);
