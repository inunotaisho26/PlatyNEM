import * as path from 'path';
import * as compress from 'compression';
import * as logger from 'morgan';
import * as serve from 'serve-static';
import {Application, Errback, Request, Response, Router} from 'express';
import {json, urlencoded} from 'body-parser';
import {isNumber, isObject, isString, map} from 'lodash';
import * as auth from '../middleware/auth.mw';
import configureRouter from './routes';
import accept from '../middleware/accept.mw';
import {root, googleAnalyticsID} from './global';
import {isFileExt, mkdir} from '../utils/utils';

import favicon = require('serve-favicon');

var cors = require('cors'),
    lusca = require('lusca');

var configure = (app: Application): void => {
    var images = path.resolve(root, 'app/images');
    app.disable('x-powered-by')
        .set('views', root + '/server/views')
        .set('view engine', 'ejs')
        .use(compress())
        .use(logger('dev'))
        .use(favicon(images + '/favicon.ico'))
        .use(json())
        .use(urlencoded({
            extended: true
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

            res.render('index', {
                googleAnalyticsID: googleAnalyticsID
            });
        });

    var staticPath: string = path.resolve(root, 'app'),
        fonts = '/fonts',
        dist = '/dist',
        platui = '/node_modules/platypusui/dist/fonts',
        fontAwesome = '/node_modules/font-awesome/fonts';

    images = '/images';

    app .use(images, accept(staticPath + images))
        .use(fonts, serve(staticPath + fonts, { index: false }))
        .use(images, serve(staticPath + images, { index: false }))
        .use(dist, serve(staticPath + dist, { index: false }))
        .use(platui, serve(root + platui, { index: false }))
        .use(fontAwesome, serve(root + fontAwesome, { index: false }))
        .use((req: Request, res: Response, next: Function) => {
            var err: Error = new Error('Not Found');
            (<any>err).status = 404;
            next(err);
        })
        .use((err: any, req: Request, res: Response, next: Function) => {
            if (isObject(err) && isString(err.message)) {
                console.log(err.toString());
                switch (err.name) {
                case 'ValidationError':
                    var query = map(err.errors, (err: Error, key: string) => {
                        return key + '=' + err.message;
                    });
                    res.redirect(200, '/register?' + encodeURI(query.join('&')));
                    break;
                default:
                    if (!isNumber(err.status) &&
                        (<string>err.toString()).toLowerCase().indexOf('not found') > -1) {
                        err.status = 404;
                    }
                }
            }
        });
};

export default configure;
