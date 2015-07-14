/// <reference path="../references.d.ts" />

import express = require('express');
import passport = require('passport');
import userProcedures = require('../config/db/procedures/users');
import userModel = require('../models/user/user.model');
import Crud = require('./crud.controller');
import fs = require('fs');
import path = require('path');
import crypto = require('crypto');
import config = require('../config/env/all');
import mailer = require('../config/utils/mailer');

var ips: { [key: string]: number; } = {};

class Controller extends Crud<typeof userProcedures, typeof userModel> {
    constructor() {
        super(userProcedures, userModel);
    }

    initialize(baseRoute: string, router: express.Router) {
        router.post(baseRoute, this.create.bind(this));
        router.post(baseRoute + '/login', this.authenticate.bind(this));
        router.post(baseRoute + '/logout', this.logout.bind(this));
        router.put(baseRoute + '/:id', this.auth.isAdmin, this.update.bind(this));
        router.get(baseRoute, this.auth.populateSession, this.auth.requiresLogin, this.auth.isAdmin, this.all.bind(this));
        router.get(baseRoute + '/admin', this.auth.populateSession, this.isAdmin.bind(this));
        router.get(baseRoute + '/me', this.auth.populateSession, this.current.bind(this));
        router.get(baseRoute + '/:id', this.auth.populateSession, this.auth.requiresLogin, this.auth.isAdmin, this.read.bind(this));
        router.delete(baseRoute + '/:id', this.auth.isAdmin, this.destroy.bind(this));
        router.post(baseRoute + '/forgot', this.createResetToken.bind(this));
        router.get(baseRoute + '/reset/:token', this.checkTokenExpiration.bind(this));
        router.post(baseRoute + '/reset/:token', this.resetPassword.bind(this))
    }

    private __createOrUpdate(req: express.Request, method: (user: models.IUser) => Thenable<any>): Thenable<any> {
        var user: models.server.IUser = req.body,
            avatar: any,
            password = (<any>req).password || (<any>user).password,
            checkPassword = this.utils.isString(password) || password === null;

        if (checkPassword) {
            user.salt = this.model.generateSalt(password);
            user.hashedpassword = this.model.generateHashedPassword(user, password);
        }

        user.role = user.role || 'visitor';

        if (this.utils.isObject(req.files) && this.utils.isObject((<any>req.files).avatar)) {
            avatar = (<any>req.files).avatar;
        }

        return this.model.validate(user, {
            checkPassword: checkPassword,
            remoteip: req.connection.remoteAddress,
            secure: req.secure
        })
        .then(() => {
            return method.call(this.procedures, user);
        }).then((id: any) => {
            if (!user.id) {
                user.id = id;
            }
            if (this.utils.isObject(avatar)) {
                return this.__uploadAvatar(avatar,user,req);
            }
        }).then(null, (errors) => {
            throw errors;
        }).then(() => {
            return user;
        });
    }

    create(req: express.Request, res: express.Response, next?: Function) {
        (<models.IUser>req.body).role = 'visitor';

        return this.__createOrUpdate(req, this.procedures.create).then((user) => {
            var response = this.format.response(null, user.id);
            if (this.utils.isObject(req.user)) {
                return response;
            }
            return <any>this.login(user, req).then(() => {
                return response;
            });
        }).then(null,(err: models.server.IValidationErrors) => {
            console.log('err', err);
            return this.format.response(err);
        }).then((response: models.IFormattedResponse) => {
            Crud.sendResponse(res, response);
        });
    }

    update(req: express.Request, res: express.Response) {
        var user: models.IUser = req.body;
        var avatar: any;

        return this.__createOrUpdate(req, this.procedures.update).then((result) => {
            return Crud.sendResponse(res, this.format.response(null, result));
        }, (err: string) => {
            return Crud.sendResponse(res, this.format.response(err, null));
        });
    }

    destroy(req: express.Request, res: express.Response) {
        var id = req.body.id = req.params.id;
        return this.handleResponse(this.procedures.read(id)
            .then((user) => {
                if (this.utils.isString(user.avatar)) {
                    return this.file.destroy(path.join(config.app.dist, user.avatar));
                }
            }).then(() => {
                return super.destroy(req, res);
            }), res);
    }

    login(user: models.IUser, req: express.Request) {
        var ip = req.connection.remoteAddress;
        var cached = ips[ip];

        if (!this.utils.isNumber(cached)) {
            cached = ips[ip] = 0;
        }

        return new this.Promise<models.IFormattedResponse>((resolve, reject) => {
            req.login(user, (err) => {
                if (this.utils.isObject(user)) {
                    delete ips[ip];
                }

                resolve(this.format.response(err, req.user));
            });
        });
    }

    logout(req: express.Request, res: express.Response) {
        req.logout();
        req.session.destroy(() => {
            Crud.sendResponse(res, this.format.response(null, true));
        });
    }

    isAdmin(req: express.Request, res: express.Response) {
        var user: models.IUser = req.user;

        if (!this.utils.isObject(user)) {
            return Crud.sendResponse(res, this.format.response(null, false));
        }

        Crud.sendResponse(res, this.format.response(null, user.role === 'admin'));
    }

    current(req: express.Request, res: express.Response) {
        Crud.sendResponse(res, this.format.response(null, req.user));
    }

    private __uploadAvatar(avatar: any, user: models.IUser, req: express.Request) {
        var errors: models.server.IValidationErrors = [];

        if (avatar.mimetype.indexOf('image') >= 0) {
            return this.file.upload(avatar.path, user.id.toString()).then((url: string) => {
                user.avatar = url;
                req.body = user;
                return this.procedures.update.call(this.procedures, user);
            }).then(() => {
                return this.file.destroy(avatar);
            });
        }
    }

    createResetToken(req: express.Request, res: express.Response) {
        var token = crypto.randomBytes(20).toString('hex');
        var email: string = req.body.email;
        var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        var fromEmail = config.smtp.username;
        var emailOptions: mailer.IMailOptions = {
            to: email,
            from: fromEmail,
            fromname: 'Password Resetter',
            subject: 'Password Reset for ' + config.app.name,
            html: '<p>You\'ve requested to reset your password at ' + config.app.name + '.</p>' +
            '<a href="' + config.app.url + '/reset-password/' + token + '">Click the here to reset</a>' +
            '<p>Ignore this email if you did not request to reset your password.</p>'
        };
        var response = {
            success: 'An email has been sent to the address you provided.'
        };

        if (this.utils.isEmpty(email) || !emailRegex.test(email)) {
            Crud.sendResponse(res, this.format.response([new this.ValidationError('Invalid email address', 'email')]));
        }

        this.procedures.createUserPasswordResetToken(email, token).then((id) => {
            if (!this.utils.isNumber(id)) {
                return this.Promise.resolve(response);
            }

            return mailer.sendEmail(emailOptions);
        }).then(() => {
            return this.format.response(undefined, response);
        }, (err: any) => {
            return this.format.response(err);
        }).then((response) => {
            Crud.sendResponse(res, response);
        });
    }

    checkTokenExpiration(req: express.Request, res: express.Response) {
        var token = req.params.token;

        return this.__checkTokenValidity(token).then(() => {
            return this.format.response(undefined, true);
        }, (err: models.server.IValidationErrors) => {
            return this.format.response(err);
        }).then((response) => {
            Crud.sendResponse(res, response);
        });
    }

    resetPassword(req: express.Request, res: express.Response) {
        var token = req.params.token;

        return this.__checkTokenValidity(token).then((user: models.server.IUser) => {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            (<any>req).password = req.body.password;
            req.body = user;
            return this.__createOrUpdate(req, this.procedures.update);
        }).then(() => {
            return this.format.response(null, {
                success: 'Your password has been updated.'
            })
        }, (errors: models.server.IValidationErrors) => {
            return this.format.response({ errors: errors });
        }).then((response) => {
            Crud.sendResponse(res, response);
        });
    }

    private __checkTokenValidity(token: string) {
        return this.procedures.findByPasswordResetToken(token);
    }

    authenticate(req: express.Request, res: express.Response) {
        var ip = req.connection.remoteAddress;
        var cached = ips[ip];

        if (this.utils.isNumber(cached)) {
            if (cached > 4) {
                Crud.sendResponse(res, this.format.response(
                    new this.ValidationError('You have exceed the maximum number of requests, try again in an hour.', 'ip')));
                return;
            }
        } else {
            ips[ip] = 0;
        }

        cached = ++ips[ip];

        this.utils.defer(() => {
            if (!this.utils.isNumber(ips[ip])) {
                return;
            }

            cached = --ips[ip];

            if (cached <= 0) {
                delete ips[ip];
            }
        }, 5);

        return new this.Promise((resolve, reject) => {
            passport.authenticate('local', (err: Error, user: models.IUser, info: any) => {
                if (this.utils.isObject(user)) {
                    return resolve(user);
                }
                reject(this.format.response(err || info));
            })(req, res, null);
        }).then((user: models.IUser) => {
            return this.login(user, req);
        }).then((response) => {
            return this.format.response(undefined, response);
        }, (response) => {
            return this.Promise.resolve(response);
        }).then((response) => {
            Crud.sendResponse(res, response);
        });
    }
}

var controller = new Controller();
export = controller;
