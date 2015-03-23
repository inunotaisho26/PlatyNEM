/// <reference path="../../typings/tsd.d.ts" />

import plat = require('platypus');

export class App extends plat.App {
	
}

plat.register.app('depot', App);