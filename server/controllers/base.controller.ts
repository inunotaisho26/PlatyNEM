/// <reference path="../references.d.ts" />

import express = require('express');
import PromiseStatic = require('es6-promise');
import ValidationError = require('../models/error/error.model');
import utils = require('../config/utils/utils');
import format = require('../config/utils/format');

var Promise = PromiseStatic.Promise;

class Controller {
	Promise: typeof Promise = Promise;
	ValidationError: typeof ValidationError = ValidationError;
	utils: typeof utils = utils;
	format: typeof format = format;

	static sendResponse(res: express.Response, response: models.IFormattedResponse): void {
		res.status(response.status).json(response.body);
	}

	sendResponse(res: express.Response, response: models.IFormattedResponse): void {
		return Controller.sendResponse(res, response);
	}
}

export = Controller;
