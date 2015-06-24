/// <reference path="../../../references.d.ts" />

import plat = require('platypus');
import $ = require('jquery');

export function jQueryFactory() {
	return $;
}

plat.register.injectable('jQuery', jQueryFactory);
