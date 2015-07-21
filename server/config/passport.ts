/// <reference path="../references.d.ts" />

import passport = require('passport');
import Local = require('passport-local');
import PromiseStatic = require('es6-promise');
import utils = require('./utils/utils');
import config = require('./env/all');
import userProcedures = require('./db/procedures/users');
import UserModel = require('../models/user/user.model');
import Facebook = require('passport-facebook');

var Promise = PromiseStatic.Promise;
var LocalStrategy = Local.Strategy;
var FacebookStrategy = Facebook.Strategy;

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
    }, (email: string, password: string, done: (err: any, user?: models.server.IUser, response ?: any) => void) => {
        userProcedures.findByEmail(email).then((user: models.server.IUser) => {
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

var findAvatar = (json: any, provider: string) => {
    switch (provider) {
        case 'facebook':
            return json.picture.data.url;
        default:
            return '';
    }
};

var handleUser = (user: models.server.IUser, profile: Facebook.Profile, provider: string) => {
    if (!utils.isObject(user)) {
       var names = profile.displayName.split('');
       var email = profile.emails[0].value;

       user = <any>{
           firstname: names.shift(),
           lastname: names.pop(),
           username: email,
           email: email,
           createdFrom: provider,
           role: 'visitor',
           provider: provider,
           hashedPassword: provider,
           salt: provider
       };
    };

    if (!(utils.isString(user.avatar) && (user.avatar.indexOf('assets/images/') > -1))) {
        user.avatar = findAvatar((<any>profile)._json, provider);
    }

    if ((<any>user)[provider + 'id'] !== profile.id) {
        (<any>user)[provider + 'id'] = profile.id

        if (utils.isNumber(user.id)) {
            return userProcedures.update(user).then(() => {
               return user;
            });
        }

        return userProcedures.create(user).then((id: number) => {
           user.id = id;
           return user;
        });
    }

    if (utils.isNumber(user.id)) {
        return userProcedures.update(user).then(() => {
            return user;
        });
    }

    return Promise.resolve(user);
};

passport.use(new FacebookStrategy(config.facebook, (accessToken: string, refreshToken: string, profile: any, done: Function) => {
    if (utils.isObject(profile) && utils.isArray(profile.emails) && profile.emails.length > 0) {
        return userProcedures.findByEmail(profile.emails[0].value).then((user: models.server.IUser) => {
            return handleUser(user, profile, 'facebook');
        }, (err: Error) => {
            done(err);
            return null;
        }).then((user: models.server.IUser) => {
            done(null, user);
        });
    }
    done({
        message: 'Could not create user from Facebook'
    });
}));

export = passportConfig;
