import * as path from 'path';
import * as crypto from 'crypto';
import {authenticate} from 'passport';
import {Request, Response, Router} from 'express';
import Base from './crud.ctrl';
import repository from '../repositories/user.repo';
import model from '../models/user';
import multer from '../middleware/multer.mw';
import {app, smtp} from '../config/global';
import {sendEmail} from '../utils/mailer';

var ips: { [key: string]: number; } = {};

class Controller extends Base<typeof repository, typeof model> {
    initialize(baseRoute: string, router: Router): void {
        var single = multer.single('avatar');

        router.post(baseRoute, single, this.create.bind(this))
            .post(baseRoute + '/login', this.authenticate.bind(this))
            .post(baseRoute + '/logout', this.logout.bind(this))
            .put(baseRoute + '/:id', this.auth.isAdmin, single, this.update.bind(this))
            .get(baseRoute, this.auth.populateSession, this.auth.requiresLogin, this.auth.isAdmin, this.all.bind(this))
            .get(baseRoute + '/admin', this.auth.populateSession, this.isAdmin.bind(this))
            .get(baseRoute + '/me', this.auth.populateSession, this.current.bind(this))
            .get(baseRoute + '/:token', this.auth.populateSession, this.auth.requiresLogin, this.auth.isAdmin, this.read.bind(this))
            .delete(baseRoute + '/:id', this.auth.isAdmin, this.destroy.bind(this))
            .post(baseRoute + '/forgot', this.createResetToken.bind(this))
            .get(baseRoute + '/reset/:token', this.checkTokenExpiration.bind(this))
            .post(baseRoute + '/reset/:token', this.resetPassword.bind(this));
    }

    create(req: Request, res: Response, next?: Function): Thenable<any> {
        (<server.models.IUser>req.body).role = 'visitor';

        return this.createOrUpdate(req, this.repository.create).then((user) => {
            var response = this.format(null, user.id);
            if (this.utils.isObject(req.user)) {
                return response;
            }
            return <any>this.login(user, req).then(() => {
                return response;
            });
        }).then(null,(err: server.errors.IValidationErrors) => {
            return this.format(err);
        }).then((response: server.utils.IFormattedResponse) => {
            Base.sendResponse(res, response);
        });
    }

    update(req: Request, res: Response): Thenable<any> {
        var user: server.models.IUser = req.body;
        var avatar: any;

        return this.createOrUpdate(req, this.repository.update).then((result) => {
            return Base.sendResponse(res, this.format(null, result));
        }, (err: string) => {
            return Base.sendResponse(res, this.format(err, null));
        });
    }

    destroy(req: Request, res: Response): Thenable<void> {
        var id = req.body.id = req.params.id;
        return this.handleResponse(this.repository.read(id)
            .then((user) => {
                if (this.utils.isString(user.avatar)) {
                    return this.file.destroy(path.join(app.dist, user.avatar));
                }
            }).then(() => {
                return super.destroy(req, res);
            }), res);
    }

    login(user: server.models.IUser, req: Request): Thenable<server.utils.IFormattedResponse> {
        var ip = req.connection.remoteAddress;
        var cached = ips[ip];

        if (!this.utils.isNumber(cached)) {
            cached = ips[ip] = 0;
        }

        return new this.Promise<server.utils.IFormattedResponse>((resolve, reject) => {
            req.login(user, (err) => {
                if (this.utils.isObject(user)) {
                    delete ips[ip];
                }

                resolve(this.format(err, req.user));
            });
        });
    }

    logout(req: Request, res: Response): void {
        req.logout();
        req.session.destroy(() => {
            Base.sendResponse(res, this.format(null, true));
        });
    }

    isAdmin(req: Request, res: Response): void {
        var user: server.models.IUser = req.user;

        if (!this.utils.isObject(user)) {
            return Base.sendResponse(res, this.format(null, false));
        }

        Base.sendResponse(res, this.format(null, user.role === 'admin'));
    }

    current(req: Request, res: Response): void {
        Base.sendResponse(res, this.format(null, req.user));
    }

    createResetToken(req: Request, res: Response): Thenable<void> {
        var token = crypto.randomBytes(20).toString('hex');
        var email: string = req.body.email;
        var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        var fromEmail = smtp.username;
        var emailOptions: server.utils.IMailOptions = {
            to: email,
            from: fromEmail,
            fromname: 'Password Resetter',
            subject: 'Password Reset for ' + app.name,
            html: '<p>You\'ve requested to reset your password at ' + app.name + '.</p>' +
            '<a href="' + app.url + '/reset-password/' + token + '">Click the here to reset</a>' +
            '<p>Ignore this email if you did not request to reset your password.</p>'
        };
        var response = {
            success: 'An email has been sent to the address you provided.'
        };

        if (this.utils.isEmpty(email) || !emailRegex.test(email)) {
            Base.sendResponse(res, this.format([new this.ValidationError('Invalid email address', 'email')]));
        }

        return this.repository.createUserPasswordResetToken(email, token).then((id) => {
            if (!this.utils.isNumber(id)) {
                return this.Promise.resolve(response);
            }

            return sendEmail(emailOptions);
        }).then(() => {
            return this.format(undefined, response);
        }, (err: any) => {
            return this.format(err);
        }).then((response) => {
            Base.sendResponse(res, response);
        });
    }

    checkTokenExpiration(req: Request, res: Response): Thenable<void> {
        var token = req.params.token;

        return this.checkTokenValidity(token).then(() => {
            return this.format(undefined, true);
        }, (err: server.errors.IValidationErrors) => {
            return this.format(err);
        }).then((response) => {
            Base.sendResponse(res, response);
        });
    }

    resetPassword(req: Request, res: Response): Thenable<void> {
        var token = req.params.token;

        return this.checkTokenValidity(token).then((user: server.models.IUser) => {
            user.resetpasswordtoken = undefined;
            user.resetpasswordexpires = undefined;
            (<any>req).password = req.body.password;
            req.body = user;
            return this.createOrUpdate(req, this.repository.update);
        }).then(() => {
            return this.format(null, {
                success: 'Your password has been updated.'
            });
        }, (errors: server.errors.IValidationErrors) => {
            return this.format({ errors: errors });
        }).then((response) => {
            Base.sendResponse(res, response);
        });
    }

    authenticate(req: Request, res: Response): Thenable<void> {
        var ip = req.connection.remoteAddress;
        var cached = ips[ip];

        if (this.utils.isNumber(cached)) {
            if (cached > 4) {
                Base.sendResponse(res, this.format(
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
            authenticate('local', (err: Error, user: server.models.IUser, info: any) => {
                if (this.utils.isObject(user)) {
                    return resolve(user);
                }
                reject(this.format(err || info));
            })(req, res, null);
        }).then((user: server.models.IUser) => {
            return this.login(user, req);
        }).then((response) => {
            Base.sendResponse(res, response);
        });
    }

    private createOrUpdate(req: Request, method: (user: server.models.IUser) => Thenable<any>): Thenable<any> {
        var user: server.models.IUser = req.body,
            avatar: any,
            password = (<any>req).password || (<any>user).password,
            checkPassword = this.utils.isString(password) || password === null;

        if (checkPassword) {
            user.salt = this.model.salt();
            user.hashedpassword = this.model.hashedPassword(user, password);
        }

        user.role = user.role || 'visitor';
        avatar = (<any>req).file;

        return this.model.validate(user, {
            checkPassword: checkPassword,
            remoteip: req.connection.remoteAddress,
            secure: req.secure
        })
        .then(() => {
            return method.call(this.repository, user);
        }).then((id: any) => {
            if (!user.id) {
                user.id = id;
            }
            if (this.utils.isObject(avatar)) {
                return this.uploadAvatar(avatar,user,req);
            }
        }).then(null, (errors) => {
            throw errors;
        }).then(() => {
            return user;
        });
    }

    private checkTokenValidity(token: string): Thenable<server.models.IUser> {
        return this.repository.findByPasswordResetToken(token);
    }

    private uploadAvatar(avatar: any, user: server.models.IUser, req: Request): Thenable<any> {
        var errors: server.errors.IValidationErrors = [];

        if (avatar.mimetype.indexOf('image') >= 0) {
            return this.file.upload(avatar.path, user.id.toString()).then((url: string) => {
                user.avatar = url;
                req.body = user;
                return this.repository.update.call(this.repository, user);
            }).then(() => {
                return this.file.destroy(avatar);
            });
        }
    }
}
var controller = new Controller(repository, model);
export default controller;
