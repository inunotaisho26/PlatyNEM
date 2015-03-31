/// <reference path="../references.d.ts" />

import express = require('express');
import bodyparser = require('body-parser');
import configureRouter = require('./routes');
import path = require('path');
import auth = require('../controllers/auth.controller');

var configure = (app: express.Application) => {
	app.set('views', path.join(__dirname, '../views'));
	app.set('view engine', 'ejs');
	app.use(bodyparser.json());
	app.route('*')
		.post(auth.populateSession)
		.put(auth.populateSession)
		.delete(auth.populateSession);
	app.use(express.static(path.join(__dirname, '../../client/dist')));
	app.use(configureRouter('/api', express.Router()));
	app.get('/*', (req: express.Request, res: express.Response) => {
		res.render('index');
	});
};

export = configure;
