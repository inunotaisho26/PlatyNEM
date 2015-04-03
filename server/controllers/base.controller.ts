/// <reference path="../references.d.ts" />

import express = require('express');
import PromiseStatic = require('es6-promise');
import ValidationError = require('../models/error/error.model');
import utils = require('../config/utils/utils');
import auth = require('./auth.controller');
import format = require('../config/utils/format');
import file = require('../config/utils/file');

var Promise = PromiseStatic.Promise;

class Controller {
	auth: typeof auth = auth;
	Promise: typeof Promise = Promise;
	ValidationError: typeof ValidationError = ValidationError;
	utils: typeof utils = utils;
	format: typeof format = format;
	file: typeof file = file;

	static sendResponse(res: express.Response, response: models.IFormattedResponse): void {
		res.status(response.status).json(response.body);
	}

	sendResponse(res: express.Response, response: models.IFormattedResponse): void {
		return Controller.sendResponse(res, response);
	}
}

export = Controller;
