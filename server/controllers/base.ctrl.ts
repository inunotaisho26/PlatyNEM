import * as utils from 'lodash';
import {Request, Response, Router} from 'express';
import {Promise} from 'es6-promise';
import * as auth from '../middleware/auth.mw';
import ValidationError from '../errors/validation.err';
import format from '../utils/response';
import * as file from '../utils/utils';

export default class Controller {
	protected auth: typeof auth = auth;
	protected utils: typeof utils = utils;
	protected Promise: typeof Promise = Promise;
	protected ValidationError: typeof ValidationError = ValidationError;
	protected format: typeof format = format;
	protected file: typeof file = file;

    protected static handleResponse(promise: Thenable<any> | any, res: Response): Thenable<void>;
    protected static handleResponse(promise: Thenable<any> | any, res: Response, req: Request, next: Function): Thenable<void>;
    protected static handleResponse(promise: Thenable<any> | any, res: Response, req?: Request, next?: Function): Thenable<void> {
        var nextCalled = false;
        return Promise.resolve(promise).then((result: any) => {
            if (utils.isFunction(next)) {
                (<any>req).token = result;
                nextCalled = true;
                return next();
            }
            return format(undefined, result);
        }).catch((err) => {
            return format(err);
        }).then((response: server.utils.IFormattedResponse) => {
            if (nextCalled) {
                return;
            }
            Controller.sendResponse(res, response);
        });
    }

    protected static sendResponse(res: Response, response: server.utils.IFormattedResponse): void {
        res.status(response.status).json(response.body);
    }

    initialize(baseRoute: string, router: Router): void {

    }

    protected handleResponse(promise: Thenable<any> | any, res: Response): Thenable<void>;
    protected handleResponse(promise: Thenable<any> | any, res: Response, req: Request, next: Function): Thenable<void>;
    protected handleResponse(promise: Thenable<any> | any, res: Response, req?: Request, next?: Function): Thenable<void> {
        return Controller.handleResponse(promise, res, req, next);
    }

    protected sendResponse(res: Response, response: server.utils.IFormattedResponse): void {
        return Controller.sendResponse(res, response);
    }
}
