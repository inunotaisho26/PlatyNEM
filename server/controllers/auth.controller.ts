/// <reference path="../references.d.ts" />

import express = require('express');
import passport = require('passport');
import utils = require('../config/utils/utils');
import config = require('../config/env/all');
import pool = require('../config/db/pool');
import SessionStore = require('../config/session/session');

/// XXX: SessionStore, as written, can't be assigned to type session.store
var session = require('express-session');

var sessionMiddleware = session({
	secret: config.sessionKey,
	resave: false,
	saveUninitialized: false,
	cookie: {
		expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
		httpOnly: true
	},
	store: new SessionStore(<any>session, {
		secret: config.sessionKey,
		pool: pool
	})
});

var passportInitialize = passport.initialize();
var passportSession = passport.session();

export var populateSession = (req: express.Request, res: express.Response, next: express.Errback) => {
	if (utils.isObject(req.session)) {
		return next(undefined);
	}

	sessionMiddleware(req, res, (err: Error) => {
		if (utils.isObject(err)) {
			return next(err);
		}

		passportInitialize(req, res, (err: Error) => {
			if (utils.isObject(err)) {
				return next(err);
			}

			passportSession(req, res, (err: Error) => {
				if (utils.isObject(err)) {
					return req.session.destroy(next);
				}
				
				next(undefined);
			});
		});
	});
}

export var isAdmin = (req: express.Request, res: express.Response, next: Function) => {
	if (checkUserRole(req, 'admin')) {
		return next();
	}

	next(createError());
};

export var isAdminRoute = (req: express.Request, next: Function) => {
	if (req.originalUrl.indexOf('/admin/') > -1 || req.originalUrl.slice(-6) === '/admin') {
		return true;
	}

	next();
	return false;
};

export var requiresLogin = (req: express.Request, res: express.Response, next: Function) => {
	if (!req.isAuthenticated()) {
		return next(createError());
	}

	next();
};

function checkUserRole(req: express.Request, ...roles: Array<string>) {
	var user: models.IUser = req.user;

	if (!utils.isObject(user)) {
		return false;
	}

	var role = user.role;

	if (!utils.isString(role)) {
		return false;
	}

	role = role.toLowerCase();

	if (roles.indexOf(user.role) > -1) {
		return true;
	}

	return false;
};

function createError() {
	var err = new Error('Not Authorized');
	(<any>err).status = 401;
	return err;
}
