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