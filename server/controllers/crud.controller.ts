/// <reference path="../references.d.ts" />

import express = require('express');
import BaseProcedures = require('../config/db/procedures/base');
import BaseController = require('./base.controller');
import BaseModel = require('../models/base.model');

type Store = BaseProcedures<any, any, any, any>;

class Controller<P extends Store, M extends BaseModel<any>> extends BaseController {
	procedures: P;
	model: M;

	constructor(procedures: P, model?: M) {
		super();

		this.procedures = procedures;
		this.model = model;
	}
}

export = Controller;
