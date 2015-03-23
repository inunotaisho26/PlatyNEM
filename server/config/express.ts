/// <reference path="../typings/tsd.d.ts" />

import express = require('express');
import path = require('path');

var configure = (app: express.Application) => {
	app.set('views', path.join(__dirname, '../views'));
	app.set('view engine', 'ejs');
	app.get('/*', (req: express.Request, res: express.Response) => {
		res.render('index');
	});
};

export = configure;
