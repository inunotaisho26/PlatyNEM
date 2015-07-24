import * as passport from 'passport';
import {Passport} from 'passport';
import {Promise} from 'es6-promise';
import {isArray, isNumber, isObject, isString} from 'lodash';
import {Strategy as LocalStrategy} from 'passport-local';
import {Profile, Strategy as FacebookStrategy} from 'passport-facebook';
import {facebook} from './global';
import procedures from '../procedures/user.proc';
import Model from '../models/user';

var configure = (passport: Passport): void => {
    passport.serializeUser((user: server.models.IUser, done: Function) => {
        if (!isObject(user)) {
            done(false);
        }
        done(null, user.id);
    });

    passport.deserializeUser((id: number, done: Function) => {
        procedures.read(id).then((u: server.models.IUser) => {
            done(null, u);
        }, (err: Error) => {
            done(err, null);
        });
    });

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, (email: string, password: string, done: (err: any, user?: server.models.IUser, response ?: any) => void) => {
        procedures.findByEmail(email).then((user: server.models.IUser) => {
            if (!isObject(user)) {
                return done(null, <any>false, {
                    message: 'User not recognized'
                });
            } else if (!Model.authenticate(user, password)) {
                return done(null, <any>false, {
                    message: 'Incorrect password'
                });
            }
            done(null, user);
        }, (err: Error) => {
            done(err, null);
        });
    }));

    passport.use(new FacebookStrategy(facebook, (accessToken: string, refreshToken: string, profile: any, done: Function) => {
        if (isObject(profile) && isArray(profile.emails) && profile.emails.length > 0) {
            return procedures.findByEmail(profile.emails[0].value).then((user: server.models.IUser) => {
                return handleUser(user, profile, 'facebook');
            }, (err: Error) => {
                done(err);
                return null;
            }).then((user: server.models.IUser) => {
                done(null, user);
            });
        }
        done({
            message: 'Could not create user from Facebook'
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

var handleUser = (user: server.models.IUser, profile: Profile, provider: string) => {
    if (!isObject(user)) {
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

    if (!(isString(user.avatar) && (user.avatar.indexOf('assets/images/') > -1))) {
        user.avatar = findAvatar((<any>profile)._json, provider);
    }

    if ((<any>user)[provider + 'id'] !== profile.id) {
        (<any>user)[provider + 'id'] = profile.id

        if (isNumber(user.id)) {
            return procedures.update(user).then(() => {
               return user;
            });
        }

        return procedures.create(user).then((id: number) => {
           user.id = id;
           return user;
        });
    }

    if (isNumber(user.id)) {
        return procedures.update(user).then(() => {
            return user;
        });
    }

    return Promise.resolve(user);
};

export default configure;
