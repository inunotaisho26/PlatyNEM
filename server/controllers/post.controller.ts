/// <reference path="../references.d.ts" />

import Crud = require('./crud.controller');
import model = require('../models/post/post.model');
import repository = require('../repositories/post.repository');
import express = require('express');

class Controller extends Crud<typeof repository, typeof model> {
	constructor() {
		super(repository, model);
	}
	
	initialize(baseRoute: string, router: express.Router) {
		router
			.get(baseRoute, this.all.bind(this))
			.get(baseRoute + '/:id', this.read.bind(this))
			.post(baseRoute, this.auth.requiresLogin, this.auth.isAdmin, this.create.bind(this));
	}
	
	all(req: express.Request, res: express.Response) {
		var published: boolean = null;
		
		if (req.query.published === 'true') {
			published = true;
		}
		
		return this.handleResponse(this.procedures.all(published, req.query.from, req.query.count), res);
	}
	
	create(req: express.Request, res: express.Response) {
		var post: models.IPost = req.body;
		
		post.created = post.created || new Date();
		return super.create(req, res);
	}
}

var controller = new Controller();
export = controller;
