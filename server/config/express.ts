import * as path from 'path';
import * as compress from 'compression';
import * as logger from 'morgan';
import * as serve from 'serve-static';
import {Application, Errback, Request, Response, Router} from 'express';
import {json, urlencoded} from 'body-parser';
import {isNumber, isObject, isString} from 'lodash';
import * as auth from '../middleware/auth.mw';
import configureRouter from './routes';
import accept from '../middleware/accept.mw';
import {root} from './global';
import {isFileExt, mkdir} from '../utils/utils';

import multer = require('multer');
import favicon = require('serve-favicon');

var cors = require('cors'),
    lusca = require('lusca');

var configure = (app: Application): void => {
    var images = path.resolve(root, 'app/images');
    app.set('views', root + '/server/views')
        .set('view engine', 'ejs')
        .use(compress())
        .use(logger('dev'))
        .use(favicon(images + '/favicon.ico'))
        .use(json())
        .use(urlencoded({
            extended: true
        }))
        .use(multer({
            dest: images + '/tmp',
            onError(err?: any, next?: Function): void {
                try {
                    console.log(err);
                    next();
                } catch (e) { }
            }
        }))
        .use(cors())
        .use((req: Request, res: Response, next: Function) => {
            if (auth.isAdminRoute(req)) {
                if (!isObject(req.session)) {
                    auth.populateSession(req, res, () => {
                        auth.requiresLogin(req, res, () => {
                            auth.isContributor(req, res, next);
                        });
                    });
                } else {
                    auth.requiresLogin(req, res, () => {
                        auth.isContributor(req, res, next);
                    });
                }
                return;
            }

            next();
        });

    app.route('*')
        .post(auth.populateSession)
        .put(auth.populateSession)
        .delete(auth.populateSession);

    app.get('/*', (req: Request, res: Response, next: Function) => {
        if (isFileExt(req.url)) {
            next();
            return;
        }

        auth.populateSession(req, res, <Errback>next);
    });

    app.get('/', (req: Request, res: Response, next: Function) => {
        res.render('index');
    })
        .get('/logout', (req: Request, res: Response, next: Function) => {
            req.logout();
            req.session.destroy(() => {
                res.redirect('/');
            });
        })
        .use(configureRouter('/api', Router()))
        .get('/*', (req: Request, res: Response, next: Function) => {
            if (isFileExt(req.url)) {
                next();
                return;
            }

            res.render('index');
        });

    var staticPath: string = path.resolve(root, 'app');

    app.use(accept(staticPath))
        .use(serve(staticPath, { index: false }))
        .use((req: Request, res: Response, next: Function) => {
            var err: Error = new Error('Not Found');
            (<any>err).status = 404;
            next(err);
        })
        .use((err: any, req: Request, res: Response, next: Function) => {
            if (isObject(err) && isString(err.message)) {
                console.log(err.toString());
                switch (err.name) {
                    default:
                        if (!isNumber(err.status) &&
                            (<string>err.toString()).toLowerCase().indexOf('not found') > -1) {
                            err.status = 404;
                        }

                        res.status(err.status || 500);
                        res.render('error', {
                            error: err
                        });
                        break;
                }
            }
        });
};

export default configure;
