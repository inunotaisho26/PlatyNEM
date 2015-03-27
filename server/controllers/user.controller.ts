/// <reference path="../references.d.ts" />

import express = require('express');
import userProcedures = require('../config/db/procedures/users');
import userModel = require('../models/user/user.model');
import Crud = require('./crud.controller');

class Controller extends Crud<typeof userProcedures, typeof userModel> {
	constructor() {
		super(userProcedures, userModel);
	}

	initialize(baseRoute: string, router: express.Router) {
		router.post(baseRoute, this.create.bind(this));
	}

	create(req: express.Request, res: express.Response, next?: Function) {
		var user: models.IUser = req.body;
		user.role = 'visitor';
		
		return this.model.generateSalt(user.password)
			.then((salt) => {
				user.salt = salt;
				return this.model.generateHashedPassword(user, user.password)
			})
			.then((hash) => {
				user.password = hash;
				return this.procedures.create(user);
			})
			.then((response) => {
				this.sendResponse(res, this.format.response(response));
			}, (err: models.IValidationErrors) => {
				this.sendResponse(res, this.format.response(err));
			});
	}

	
}

var controller = new Controller();
export = controller;
