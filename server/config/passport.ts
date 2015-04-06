/// <reference path="../references.d.ts" />

import passport = require('passport');
import Local = require('passport-local');
import PromiseStatic = require('es6-promise');
import utils = require('./utils/utils');
import userProcedures = require('./db/procedures/users');
import UserModel = require('../models/user/user.model');

var Promise = PromiseStatic.Promise,
    LocalStrategy = Local.Strategy;

var passportConfig = (passport: passport.Passport) => {
    passport.serializeUser((user: models.IUser, done: Function) => {
        if (!utils.isObject(user)) {
            done(false);
        }
        done(null, user.id);
    });

    passport.deserializeUser((id: number, done: Function) => {
        userProcedures.read(id).then((u: models.IUser) => {
            done(null, u);
        }, (err: Error) => {
            done(err, null);
        });
    });

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, (email: string, password: string, done: (err: any, user?: models.IUser, response ?: any) => void) => {
        userProcedures.findByEmail(email).then((user: models.IUser) => {
            if (!utils.isObject(user)) {
                return done(null, <any>false, {
                    message: 'User not recognized'
                });
            } else if (!UserModel.authenticate(user, password)) {
                return done(null, <any>false, {
                    message: 'Incorrect password'
                });
            }
            done(null, user);
        }, (err: Error) => {
            done(err, null);
        });
    }));
};

export = passportConfig;
