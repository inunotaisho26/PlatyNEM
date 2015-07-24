import * as passport from 'passport';
import {Passport} from 'passport';
import {isObject} from 'lodash';
import {Strategy as LocalStrategy} from 'passport-local';
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
};

export default configure;
