/// <reference path="../references.d.ts" />

import express = require('express');
import passport = require('passport');
import userProcedures = require('../config/db/procedures/users');
import userModel = require('../models/user/user.model');
import Crud = require('./crud.controller');
import fs = require('fs');

var ips: { [key: string]: number; } = {};

class Controller extends Crud<typeof userProcedures, typeof userModel> {
	constructor() {
		super(userProcedures, userModel);
	}

	initialize(baseRoute: string, router: express.Router) {
		router.post(baseRoute, this.create.bind(this));
		router.post(baseRoute + '/login', this.authenticate.bind(this));
		router.post(baseRoute + '/logout', this.logout.bind(this));
		router.get(baseRoute, this.auth.populateSession, this.auth.requiresLogin, this.auth.isAdmin, this.all.bind(this));
		router.get(baseRoute + '/admin', this.auth.populateSession, this.isAdmin.bind(this));
	}

	create(req: express.Request, res: express.Response, next?: Function) {
		var user: models.IUser = req.body;
		var avatar: any;
		user.role = 'visitor';
		
		if (this.utils.isObject(req.files) && this.utils.isObject(req.files.avatar)) {
			avatar = req.files.avatar;
		}

		return this.model.generateSalt(user.password)
			.then((salt) => {
				user.salt = salt;
                return this.model.generateHashedPassword(user, user.password);
			})
			.then((hash) => {
				user.password = hash;
                console.log(user);
				return this.procedures.create(user);
			})
			.then((id: any) => {
				if (!user.id) {
					user.id = id;
				}
				if (this.utils.isObject(avatar)) {
					return this.__uploadAvatar(avatar, user, req);
				}
			})
			.then((response) => {
				this.sendResponse(res, this.format.response(response));
			}, (err: models.IValidationErrors) => {
				this.sendResponse(res, this.format.response(err));
			});
	}

	login(user: models.IUser, req: express.Request) {
		var ip = req.connection.remoteAddress;
		var cached = ips[ip];

		if (!this.utils.isNumber(cached)) {
			cached = ips[ip] = 0;
		}

		return new this.Promise<models.IFormattedResponse>((resolve, reject) => {
			req.login(user, (err) => {
				if (this.utils.isObject(user)) {
					delete ips[ip];
				}

				resolve(this.format.response(err, req.user));
			});
		});	
	}

	logout(req: express.Request, res: express.Response) {
		req.logout();
		req.session.destroy(() => {
			Crud.sendResponse(res, this.format.response(null, true));
		});
	}

	isAdmin(req: express.Request, res: express.Response) {
		var user: models.IUser = req.user;
		
		if (!this.utils.isObject(user)) {
			return Crud.sendResponse(res, this.format.response(null, false));
		}
		
		Crud.sendResponse(res, this.format.response(null, user.role === 'admin'));
	}

	private __uploadAvatar(avatar: any, user: models.IUser, req: express.Request) {
		var errors: models.IValidationErrors = [];
		console.log('upload avi');
		if (avatar.mimetype.indexOf('image') >= 0) {
			return this.file.upload(avatar.path, user.id.toString()).then((url: string) => {
				console.log(url);
				user.avatar = url;
				req.body = user;
				return this.procedures.update.call(this.procedures, user);
			}).then(() => {
				return this.file.destroy(avatar);
			});
		}
	}

	authenticate(req: express.Request, res: express.Response) {
		var ip = req.connection.remoteAddress;
		var cached = ips[ip];

		if (this.utils.isNumber(cached)) {
			if (cached > 4) {
				Crud.sendResponse(res, this.format.response(
					new this.ValidationError('You have exceed the maximum number of requests, try again in an hour.', 'ip')));
				return;
			}
		} else {
			ips[ip] = 0;
		}

		cached = ++ips[ip];

		this.utils.defer(() => {
			if (!this.utils.isNumber(ips[ip])) {
				return;
			}

			cached = --ips[ip];

			if (cached <= 0) {
				delete ips[ip];
			}
		}, 3600000);

		return new this.Promise((resolve, reject) => {
			passport.authenticate('local', (err: Error, user: models.IUser, info: any) => {
				if (this.utils.isObject(user)) {
					return resolve(user);
				}
				reject(this.format.response(err || info));
			})(req, res, null);
		}).then((user: models.IUser) => {
			return this.login(user, req);
		}).then((response) => {
			Crud.sendResponse(res, response);
		});
	}
}

var controller = new Controller();
export = controller;
