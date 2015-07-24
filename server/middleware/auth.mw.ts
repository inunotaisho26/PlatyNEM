import * as session from 'express-session';
import * as passport from 'passport';
import {Errback, Request, Response} from 'express';
import {isObject, isString} from 'lodash';

import SessionStore from './session.mw';
import {secret} from '../config/global';
import {procedure} from '../config/db';

var sessionMiddleWare = session({
    	secret,
    	resave: false,
    	saveUninitialized: false,
    	cookie: {
            // 7 days
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            httpOnly: true
        },
        store: new SessionStore(<any>session, {
            secret: secret,
            callProcedure: procedure
        })
    }),
    passportInitialize = passport.initialize(),
    passportSession = passport.session();

export var populateSession = (req: Request, res: Response, next: Errback) => {
    if (isObject(req.session)) {
        return next(undefined);
    }

    sessionMiddleWare(req, res,(err: Error) => {
        if (isObject(err)) {
            return next(err);
        }

        passportInitialize(req, res,(err: Error) => {
            if (isObject(err)) {
                return next(err);
            }

            passportSession(req, res,(err: Error) => {
                if (isObject(err)) {
                    return req.session.destroy(next);
                }

                next(undefined);
            });
        });
    });
};

export var requiresLogin = (req: Request, res: Response, next: Function) => {
    if (!req.isAuthenticated()) {
        return next(createError());
    }
    next();
};

export var checkUserRole = (req: Request, ...roles: Array<string>): boolean => {
    var user: any = req.user;

    if (!isObject(user)) {
        return false;
    }

    var role = user.role;

    if (!isString(role)) {
        return false;
    }

    role = role.toLowerCase();

    if (roles.indexOf(user.role) > -1) {
        return true;
    }

    return false;
};

export var isAdmin = (req: Request, res: Response, next: Function) => {
    if (checkUserRole(req, 'admin')) {
        return next();
    }

    next(createError());
};

export var isContributor = (req: Request, res: Response, next: Function) => {
    if (checkUserRole(req, 'admin', 'contributor')) {
        return next();
    }

    next(createError());
};

export var isAdminRoute = (req: Request): boolean => {
    if (req.originalUrl.indexOf('/admin/') > -1 || req.originalUrl.slice(-6) === '/admin') {
        return true;
    }

    return false;
};

function createError(): Error {
    var err = new Error('Not Authorized');
    (<any>err).status = 401;

    return err;
}
