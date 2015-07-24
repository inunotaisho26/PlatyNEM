import {resolve} from 'path';
import {forEach} from 'lodash';

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

console.log(`Running in the ${env} environment.`);

var cfg: server.config.IConfig = require('./env/' + env + '.json');

export var app: server.config.IAppConfig = cfg.app;
export var db: server.config.IDatabaseConfig = cfg.db;
export var environment = {
	prod: env === 'prod',
	dev: env === 'dev',
	test: env === 'test'
};
export var facebook: server.config.IFacebookConfig = cfg.facebook;
export var googleAnalyticsID: number = cfg.googleAnalyticsID;
export var port: number = process.env.PORT || 3000;
export var root: string = resolve(__dirname + '/../..');
export var secret: string = cfg.secret;
export var smtp: server.config.ISmtpConfig = cfg.smtp;
