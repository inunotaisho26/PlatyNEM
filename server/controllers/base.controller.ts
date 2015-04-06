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

    static handleResponse(promise: Thenable<any> | any, res: express.Response): Thenable<void>;
    static handleResponse(promise: Thenable<any> | any, res: express.Response, req: express.Request, next: Function): Thenable<void>;
    static handleResponse(promise: Thenable<any> | any, res: express.Response, req?: express.Request, next?: Function): Thenable<void> {
        var nextCalled = false;
        
        return Promise.resolve(promise).then((result: any) => {
            if (utils.isFunction(next)) {
                (<any>req).token = result;
                nextCalled = true;
                return next();
            }
            return format.response(undefined, result);
        }).catch((err) => {
            return format.response(err);
        }).then((response: models.IFormattedResponse) => {
            if (nextCalled) {
                return;
            }
            Controller.sendResponse(res, response);
        });
    }

    handleResponse(promise: Thenable<any> | any, res: express.Response): Thenable<void>;
    handleResponse(promise: Thenable<any> | any, res: express.Response, req: express.Request, next: Function): Thenable<void>;
    handleResponse(promise: Thenable<any> | any, res: express.Response, req?: express.Request, next?: Function): Thenable<void> {
        return Controller.handleResponse(promise, res, req, next);
    }
}

export = Controller;
