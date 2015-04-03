/// <reference path="../references.d.ts" />

import express = require('express');
import bodyparser = require('body-parser');
import configureRouter = require('./routes');
import path = require('path');
import auth = require('../controllers/auth.controller');
import utils = require('./utils/utils');

var multer = require('multer');

var configure = (app: express.Application, config: any) => {
	app.set('views', path.join(__dirname, '../views'));
	app.set('view engine', 'ejs');
	app.use(bodyparser.json());
	app.use(multer({
		dest: path.join(config.app.dist + config.app.uploads),
		onError(err: any, next: Function) {
			console.log(err);
			next();
		}
	}));
	app.route('*')
		.post(auth.populateSession)
		.put(auth.populateSession)
		.delete(auth.populateSession);
	app.use((req: express.Request, res: express.Response, next: Function) => {
		if (auth.isAdminRoute(req, next)) {
			if (!utils.isObject(req.session)) {
				auth.populateSession(req, res, () => {
					auth.requiresLogin(req, res, () => {
						auth.isAdmin(req, res, next);
					});
				});
			} else {
				auth.requiresLogin(req, res, () => {
					auth.isAdmin(req, res, next);
				});
			}
		}
	});
	app.use(express.static(path.resolve(config.app.dist)));
	app.use(configureRouter('/api', express.Router()));
	app.get('/*', (req: express.Request, res: express.Response) => {
		res.render('index');
	});
	app.use((err: any, req: express.Request, res: express.Response, next: Function) => {
		if (utils.isObject(err) && utils.isString(err.message)) {
			console.log(err.toString());
			switch (err.name) {
				case 'ValidationError':
					var query = utils.map(err.errors, (err: Error, key: string) => {
						return key + '=' + err.message;
					});
					res.redirect(200, '/register?' + encodeURI(query.join('&')));
					break;
				default:
					if (!utils.isNumber(err.status) &&
						(<string>err.toString()).toLowerCase().indexOf('not found') > -1) {
						err.status = 404;
					}

					res.status(err.status || 500);
					res.render('error', { error: err });
					break;
			}
		}
	});
};

export = configure;
